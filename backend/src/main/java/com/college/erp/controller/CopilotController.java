package com.college.erp.controller;

import com.college.erp.model.AuditLog;
import com.college.erp.model.CopilotLog;
import com.college.erp.repository.CopilotLogRepository;
import com.college.erp.service.AuditService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/copilot")
public class CopilotController {

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    
    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String modelName;

    private static final String SYSTEM_PROMPT = """
            You are Alma Copilot, the AI assistant embedded in the Alma Academic Command Center — an ERP platform for higher-education institutions.
            
            Your role:
            - Answer concise, factual questions about student attendance, GPA, fee accounts, leave workflows, and academic risk scores
            - Help Admin/HoD users take actions like approving leaves or dispatching HoD alerts
            - Always respond in plain English first, then optionally include a brief technical note
            
            Campus context (demo data):
            - Students: Alex Rivera (CS2024-042, 88% att, GPA 3.6), Ananya Patel (ECE-BS, 74% att — BELOW THRESHOLD), Vikram Singh (MECH-BS, 62% att, Risk Score 78/100, ₹68,000 fee overdue 36 days)
            - Pending leaves: Prof. Marcus Vance — Medical Leave 25–27 Jul 2026 (awaiting HoD approval)
            - Institution averages: 92.4% attendance, 95% pass rate, 78.5% fee recovery
            
            Response format:
            - Keep responses short (2–4 sentences or a brief bullet list)
            - Use **bold** for student names, numbers, and key facts
            - Do not repeat the user's question back
            - If asked to approve a leave or trigger an alert, confirm the action details and ask for explicit confirmation
            """;

    @Value("${groq.api-key:}")
    private String groqApiKey;

    private final CopilotLogRepository copilotLogRepo;
    private final AuditService auditService;
    private final RestTemplate restTemplate = new RestTemplate();

    public CopilotController(CopilotLogRepository copilotLogRepo, AuditService auditService) {
        this.copilotLogRepo = copilotLogRepo;
        this.auditService = auditService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> body, Authentication auth) {
        String prompt = body.getOrDefault("prompt", "").trim();
        if (prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "prompt is required"));
        }

        // If GROQ_API_KEY is not configured or empty, provide instant smart demo response
        if (groqApiKey == null || groqApiKey.isBlank()) {
            return ResponseEntity.ok(generateLocalDemoResponse(prompt, auth));
        }

        try {
            Map<String, Object> requestBody = Map.of(
                "model", modelName,
                "messages", List.of(
                    Map.of("role", "system",  "content", SYSTEM_PROMPT),
                    Map.of("role", "user",    "content", prompt)
                ),
                "max_tokens", 512,
                "temperature", 0.4
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> groqResponse = restTemplate.postForEntity(GROQ_URL, request, Map.class);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices =
                (List<Map<String, Object>>) groqResponse.getBody().get("choices");

            @SuppressWarnings("unchecked")
            Map<String, String> message =
                (Map<String, String>) choices.get(0).get("message");

            String answer = message.get("content");

            @SuppressWarnings("unchecked")
            Map<String, Object> usage =
                (Map<String, Object>) groqResponse.getBody().get("usage");

            String trace = String.format(
                "Model: %s\nPrompt tokens: %s | Completion tokens: %s\nEndpoint: POST %s\nTimestamp: %s",
                modelName,
                usage != null ? usage.get("prompt_tokens") : "—",
                usage != null ? usage.get("completion_tokens") : "—",
                GROQ_URL,
                LocalDateTime.now()
            );

            // Persist CopilotLog to Mongo
            saveCopilotLog(prompt, answer, auth);

            return ResponseEntity.ok(Map.of(
                "answer", answer,
                "trace",  trace,
                "model",  modelName
            ));

        } catch (Exception e) {
            // Smooth fallback for API rate limit / 403 Forbidden / Network error
            return ResponseEntity.ok(generateLocalDemoResponse(prompt, auth));
        }
    }

    private Map<String, Object> generateLocalDemoResponse(String prompt, Authentication auth) {
        String lower = prompt.toLowerCase();
        String answer;

        if (lower.contains("hi") || lower.contains("hello") || lower.contains("hey")) {
            answer = "Hello! I am **Alma AI Copilot**. I can help you inspect student attendance records, fee default risk scores, or assist with approving faculty leave requests.";
        } else if (lower.contains("leave") || lower.contains("approve")) {
            answer = "Found 1 pending leave request for **Prof. Marcus Vance** (Medical Leave: 25–27 Jul 2026). Would you like me to approve this leave?";
        } else if (lower.contains("risk") || lower.contains("at-risk") || lower.contains("vikram")) {
            answer = "Student **Vikram Singh (ME2024-003)** is currently flagged with a **High Risk Score of 78/100**. Attendance is at **62%** and fee dues of **₹68,000** are overdue by **36 days**.";
        } else if (lower.contains("alex") || lower.contains("rivera") || lower.contains("student")) {
            answer = "Student **Alex Rivera (CS2024-042)** is in good academic standing with **88% attendance** and a **3.6 GPA**.";
        } else {
            answer = "Currently analyzing academic data for **" + prompt + "**. All campus departments are operational with **92.4% average attendance** and **78.5% fee recovery**.";
        }

        String trace = String.format(
            "Mode: Intelligent Demo Engine (Fallback)\nModel: %s\nPrompt: %s\nTimestamp: %s",
            modelName,
            prompt,
            LocalDateTime.now()
        );

        saveCopilotLog(prompt, answer, auth);

        return Map.of(
            "answer", answer,
            "trace",  trace,
            "model",  modelName + " (Demo Fallback Mode)"
        );
    }

    private void saveCopilotLog(String prompt, String answer, Authentication auth) {
        try {
            CopilotLog logEntry = new CopilotLog();
            logEntry.setActorId(auth != null ? auth.getName() : "anonymous");
            logEntry.setActorName(auth != null ? auth.getName() : "Anonymous User");
            logEntry.setActorType("copilot");
            logEntry.setPrompt(prompt);
            logEntry.setResolvedAction(answer);
            logEntry.setConfirmed(true);
            logEntry.setTimestamp(LocalDateTime.now());
            copilotLogRepo.save(logEntry);
        } catch (Exception ignored) {}
    }

    @PostMapping("/execute-action")
    public ResponseEntity<Map<String, Object>> executeAction(@RequestBody Map<String, Object> payload, Authentication auth) {
        String actionType = payload.getOrDefault("actionType", "unknown").toString();
        AuditLog audit = auditService.log(
            auth != null ? auth.getName() : "copilot",
            extractRole(auth),
            "COPILOT_ACTION_EXECUTED_" + actionType.toUpperCase(),
            "copilot_actions",
            "cop_" + System.currentTimeMillis(),
            null,
            payload
        );

        return ResponseEntity.ok(Map.of(
            "status",     "SUCCESS",
            "action",     actionType,
            "actorType",  "copilot",
            "auditLogId", audit.getId() != null ? audit.getId() : "aud_mock_123",
            "executedAt", LocalDateTime.now().toString()
        ));
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
