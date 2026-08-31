package com.college.erp.controller;

import com.college.erp.model.Leave;
import com.college.erp.repository.LeaveRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveRepository leaveRepo;
    private final AuditService auditService;

    public LeaveController(LeaveRepository leaveRepo, AuditService auditService) {
        this.leaveRepo = leaveRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Leave> getAll() {
        return leaveRepo.findAll();
    }

    @GetMapping("/pending")
    public List<Leave> getPending() {
        return leaveRepo.findByStatus("PENDING");
    }

    @GetMapping("/{leaveId}")
    public ResponseEntity<Leave> getByLeaveId(@PathVariable String leaveId) {
        return leaveRepo.findByLeaveId(leaveId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Leave create(@RequestBody Leave leave, Authentication auth) {
        leave.setStatus("PENDING");
        Leave saved = leaveRepo.save(leave);
        auditService.log(
            auth != null ? auth.getName() : "system",
            extractRole(auth),
            "LEAVE_CREATED", "leaves", saved.getId(), null, saved
        );
        return saved;
    }

    @PutMapping("/{leaveId}/decision")
    public ResponseEntity<Leave> decide(
            @PathVariable String leaveId,
            @RequestBody Map<String, String> body,
            Authentication auth) {

        return leaveRepo.findByLeaveId(leaveId).map(leave -> {
            Leave before = snapshot(leave);
            String decision = body.getOrDefault("decision", "").toUpperCase();
            if (!decision.equals("APPROVED") && !decision.equals("REJECTED")) {
                return ResponseEntity.badRequest().<Leave>build();
            }
            leave.setStatus(decision);
            leave.setDecidedBy(auth != null ? auth.getName() : "system");
            leave.setDecidedAt(LocalDateTime.now().toString());
            Leave saved = leaveRepo.save(leave);
            auditService.log(
                auth != null ? auth.getName() : "system",
                extractRole(auth),
                "LEAVE_" + decision, "leaves", saved.getId(), before, saved
            );
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{leaveId}")
    public ResponseEntity<Void> delete(@PathVariable String leaveId, Authentication auth) {
        return leaveRepo.findByLeaveId(leaveId).map(leave -> {
            auditService.log(
                auth != null ? auth.getName() : "system",
                extractRole(auth),
                "LEAVE_DELETED", "leaves", leave.getId(), leave, null
            );
            leaveRepo.delete(leave);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    private Leave snapshot(Leave l) {
        Leave copy = new Leave();
        copy.setId(l.getId()); copy.setLeaveId(l.getLeaveId());
        copy.setApplicantName(l.getApplicantName()); copy.setStatus(l.getStatus());
        copy.setDecidedBy(l.getDecidedBy()); copy.setDecidedAt(l.getDecidedAt());
        return copy;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream()
            .findFirst().map(a -> a.getAuthority().replace("ROLE_", ""))
            .orElse("UNKNOWN");
    }
}
