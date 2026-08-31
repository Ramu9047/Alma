package com.college.erp.service;

import com.college.erp.model.AuditLog;
import com.college.erp.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Component
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AuditService(AuditLogRepository auditLogRepository, SimpMessagingTemplate messagingTemplate) {
        this.auditLogRepository = auditLogRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public AuditLog log(String actorUsername, String actorRole,
                        String action, String collectionName,
                        String recordId, Object beforeState, Object afterState) {
        AuditLog entry = new AuditLog();
        entry.setActorUsername(actorUsername);
        entry.setActorRole(actorRole);
        entry.setAction(action);
        entry.setCollectionName(collectionName);
        entry.setRecordId(recordId);
        entry.setBeforeState(beforeState);
        entry.setAfterState(afterState);
        entry.setTimestamp(LocalDateTime.now());

        AuditLog saved = auditLogRepository.save(entry);

        // Broadcast STOMP event to /topic/pulse for real-time WebSocket clients
        try {
            messagingTemplate.convertAndSend("/topic/pulse", Map.of(
                "id", saved.getId(),
                "action", saved.getAction(),
                "message", String.format("%s (%s) executed %s on %s", actorUsername, actorRole, action, collectionName),
                "timestamp", saved.getTimestamp().toString()
            ));
        } catch (Exception e) {
            log.warn("Failed to broadcast STOMP pulse message: {}", e.getMessage());
        }

        return saved;
    }
}
