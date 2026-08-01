package com.college.erp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
