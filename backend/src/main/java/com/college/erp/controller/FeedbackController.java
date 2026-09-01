package com.college.erp.controller;

import com.college.erp.model.Feedback;
import com.college.erp.repository.FeedbackRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepo;
    private final AuditService auditService;

    public FeedbackController(FeedbackRepository feedbackRepo, AuditService auditService) {
        this.feedbackRepo = feedbackRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Feedback> getAll() {
        return feedbackRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<Feedback> create(@RequestBody Map<String, String> payload, Authentication auth) {
        String username = auth != null ? auth.getName() : "anonymous";
        String role = extractRole(auth);
        String subject = payload.getOrDefault("subject", "General Inquiry");
        String content = payload.getOrDefault("content", "");

        Feedback fb = new Feedback(username, role, subject, content);
        Feedback saved = feedbackRepo.save(fb);

        auditService.log(username, role, "FEEDBACK_CREATED", "feedback", saved.getId(), null, saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<Feedback> addReply(@PathVariable String id, @RequestBody Map<String, String> payload, Authentication auth) {
        String username = auth != null ? auth.getName() : "anonymous";
        String role = extractRole(auth);
        String text = payload.getOrDefault("text", "");

        return feedbackRepo.findById(id).map(existing -> {
            Feedback before = snapshot(existing);
            existing.getReplies().add(new Feedback.Reply(username, text));
            if ("STAFF".equals(role) || "ADMIN_HOD".equals(role) || "SUPER_ADMIN".equals(role)) {
                existing.setStatus("Resolved");
            }
            Feedback saved = feedbackRepo.save(existing);
            auditService.log(username, role, "FEEDBACK_REPLIED", "feedback", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    private Feedback snapshot(Feedback f) {
        Feedback c = new Feedback();
        c.setId(f.getId()); c.setStatus(f.getStatus());
        return c;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
