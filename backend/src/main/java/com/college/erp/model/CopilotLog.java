package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "copilotLogs")
public class CopilotLog {

    @Id
    private String id;
    private String actorId;
    private String actorName;
    private String actorType; // "copilot"
    private String prompt;
    private String resolvedAction;
    private boolean confirmed;
    private String auditLogId;
    private LocalDateTime timestamp;

    public CopilotLog() {}

    public CopilotLog(String id, String actorId, String actorName, String actorType, String prompt, String resolvedAction, boolean confirmed, String auditLogId, LocalDateTime timestamp) {
        this.id = id;
        this.actorId = actorId;
        this.actorName = actorName;
        this.actorType = actorType;
        this.prompt = prompt;
        this.resolvedAction = resolvedAction;
        this.confirmed = confirmed;
        this.auditLogId = auditLogId;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorType() { return actorType; }
    public void setActorType(String actorType) { this.actorType = actorType; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getResolvedAction() { return resolvedAction; }
    public void setResolvedAction(String resolvedAction) { this.resolvedAction = resolvedAction; }

    public boolean isConfirmed() { return confirmed; }
    public void setConfirmed(boolean confirmed) { this.confirmed = confirmed; }

    public String getAuditLogId() { return auditLogId; }
    public void setAuditLogId(String auditLogId) { this.auditLogId = auditLogId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
