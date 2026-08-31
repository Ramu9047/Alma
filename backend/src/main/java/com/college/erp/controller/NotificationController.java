package com.college.erp.controller;

import com.college.erp.model.AuditLog;
import com.college.erp.repository.AuditLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class NotificationController {

    private final AuditLogRepository auditLogRepo;

    public NotificationController(AuditLogRepository auditLogRepo) {
        this.auditLogRepo = auditLogRepo;
    }

    @GetMapping({"/api/admin/notifications", "/api/student/notifications", "/api/staff/notifications"})
    public ResponseEntity<List<Map<String, Object>>> getNotifications() {
        List<AuditLog> recentLogs = auditLogRepo.findAll();
        // Return most recent audit logs as system notifications
        List<Map<String, Object>> list = new ArrayList<>();
        recentLogs.stream().sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp())).limit(15).forEach(log -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", log.getId());
            map.put("title", log.getAction().replace("_", " "));
            map.put("message", String.format("Actor %s (%s) performed %s on %s",
                log.getActorUsername(), log.getActorRole(), log.getAction(), log.getCollectionName()));
            map.put("timestamp", log.getTimestamp().toString());
            map.put("type", log.getAction().contains("DELETE") ? "WARNING" : "INFO");
            list.add(map);
        });
        return ResponseEntity.ok(list);
    }
}
