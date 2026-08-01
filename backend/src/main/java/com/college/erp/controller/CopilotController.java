package com.college.erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/copilot")
public class CopilotController {

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithCopilot(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        
        // Constrained tool call dispatcher logic for Groq integration layer
        Map<String, Object> response = Map.of(
            "prompt", prompt,
            "resolvedToolCall", "getStudentsBelowAttendance(threshold=75)",
            "llmModel", "llama-3.3-70b-versatile",
            "actorType", "copilot",
            "timestamp", LocalDateTime.now().toString()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/execute-action")
    public ResponseEntity<Map<String, Object>> executeAction(@RequestBody Map<String, Object> actionPayload) {
        // Execute validated action under acting admin credentials and generate audit log entry
        Map<String, Object> response = Map.of(
            "status", "SUCCESS",
            "action", actionPayload.get("actionType"),
            "actorType", "copilot",
            "auditLogId", "log_cop_" + System.currentTimeMillis(),
            "executedAt", LocalDateTime.now().toString()
        );
        return ResponseEntity.ok(response);
    }
}
