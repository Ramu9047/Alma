package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "audit_logs")
public class AuditLog {
    @Id private String id;
    private String actorUsername;
    private String actorRole;
    private String action;           // e.g. "LEAVE_APPROVED", "STUDENT_CREATED"
    private String collectionName;   // e.g. "leaves", "students"
    private String recordId;
    private Object beforeState;
    private Object afterState;
    private LocalDateTime timestamp;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getActorUsername() { return actorUsername; }
    public void setActorUsername(String actorUsername) { this.actorUsername = actorUsername; }
    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getCollectionName() { return collectionName; }
    public void setCollectionName(String collectionName) { this.collectionName = collectionName; }
    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }
    public Object getBeforeState() { return beforeState; }
    public void setBeforeState(Object beforeState) { this.beforeState = beforeState; }
    public Object getAfterState() { return afterState; }
    public void setAfterState(Object afterState) { this.afterState = afterState; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
