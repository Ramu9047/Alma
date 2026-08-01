package com.college.erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * LeaveController — manages leave requests.
 * PUT /api/leaves/{leaveId}/decision requires ROLE_ADMIN_HOD or ROLE_SUPER_ADMIN.
 * Students and Parents will receive 403 Forbidden from Spring Security before
 * reaching this controller — this is the enforcement we're testing.
 */
@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @PutMapping("/{leaveId}/decision")
    public ResponseEntity<?> decideLeave(
            @PathVariable String leaveId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        String decision = body.getOrDefault("decision", "PENDING");
        String actor    = authentication != null ? authentication.getName() : "unknown";
        String role     = authentication != null ? authentication.getAuthorities().toString() : "none";

        return ResponseEntity.ok(Map.of(
            "leaveId",     leaveId,
            "decision",    decision,
            "actor",       actor,
            "actorRole",   role,
            "auditLogId",  "log_" + System.currentTimeMillis(),
            "executedAt",  LocalDateTime.now().toString(),
            "status",      "SUCCESS"
        ));
    }

    @GetMapping
    public ResponseEntity<?> getLeaves(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
            "leaves", java.util.List.of(
                Map.of("id", "lev_01", "student", "Alex Rivera", "reason", "Medical", "status", "PENDING"),
                Map.of("id", "lev_02", "student", "Priya Sharma", "reason", "Family", "status", "APPROVED")
            ),
            "requestedBy", authentication != null ? authentication.getName() : "unknown"
        ));
    }
}
