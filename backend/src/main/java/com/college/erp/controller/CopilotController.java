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
    private static final String MODEL    = "openai/gpt-oss-120b";

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

    @Value("${groq.api-key}")
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

        try {
            Map<String, Object> requestBody = Map.of(
                "model", MODEL,
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
                MODEL,
                usage != null ? usage.get("prompt_tokens") : "—",
                usage != null ? usage.get("completion_tokens") : "—",
                GROQ_URL,
                LocalDateTime.now()
            );

            // Persist CopilotLog to Mongo
            CopilotLog logEntry = new CopilotLog();
            logEntry.setActorId(auth != null ? auth.getName() : "anonymous");
            logEntry.setActorName(auth != null ? auth.getName() : "Anonymous User");
            logEntry.setActorType("copilot");
            logEntry.setPrompt(prompt);
            logEntry.setResolvedAction(answer);
            logEntry.setConfirmed(true);
            logEntry.setTimestamp(LocalDateTime.now());
            copilotLogRepo.save(logEntry);

            return ResponseEntity.ok(Map.of(
                "answer", answer,
                "trace",  trace,
                "model",  MODEL,
                "logId",  logEntry.getId() != null ? logEntry.getId() : ""
            ));

        } catch (Exception e) {
            String errMsg = e.getMessage() != null ? e.getMessage() : "Unknown error";
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of(
                "error", "Groq API call failed: " + errMsg
            ));
        }
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
            "auditLogId", audit.getId(),
            "executedAt", LocalDateTime.now().toString()
        ));
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
