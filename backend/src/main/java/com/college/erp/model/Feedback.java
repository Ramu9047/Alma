package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "feedback")
public class Feedback {
    @Id
    private String id;
    private String authorUsername;
    private String authorRole;
    private String subject;
    private String content;
    private String status; // "Open" | "Resolved"
    private List<Reply> replies = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();

    public Feedback() {}

    public Feedback(String authorUsername, String authorRole, String subject, String content) {
        this.authorUsername = authorUsername;
        this.authorRole = authorRole;
        this.subject = subject;
        this.content = content;
        this.status = "Open";
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Reply> getReplies() { return replies; }
    public void setReplies(List<Reply> replies) { this.replies = replies; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class Reply {
        private String authorUsername;
        private String text;
        private LocalDateTime timestamp = LocalDateTime.now();

        public Reply() {}

        public Reply(String authorUsername, String text) {
            this.authorUsername = authorUsername;
            this.text = text;
            this.timestamp = LocalDateTime.now();
        }

        public String getAuthorUsername() { return authorUsername; }
        public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}
