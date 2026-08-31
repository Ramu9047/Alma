package com.college.erp.controller;

import com.college.erp.model.Fee;
import com.college.erp.repository.FeeRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/fees")
public class FeeController {

    private final FeeRepository feeRepo;
    private final AuditService auditService;

    public FeeController(FeeRepository feeRepo, AuditService auditService) {
        this.feeRepo = feeRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Fee> getAll() {
        return feeRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getById(@PathVariable String id) {
        return feeRepo.findById(id).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Fee> getByStudentId(@PathVariable String studentId) {
        return feeRepo.findByStudentId(studentId);
    }

    @PostMapping
    public ResponseEntity<Fee> create(@RequestBody Fee fee, Authentication auth) {
        Fee saved = feeRepo.save(fee);
        auditService.log(auth != null ? auth.getName() : "system",
            extractRole(auth), "FEE_RECORD_CREATED", "fees", saved.getId(), null, saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> update(@PathVariable String id, @RequestBody Fee body, Authentication auth) {
        return feeRepo.findById(id).map(existing -> {
            Fee before = cloneFee(existing);
            existing.setAmount(body.getAmount());
            existing.setPaid(body.getPaid());
            existing.setDueDate(body.getDueDate());
            existing.setOverdueDays(body.getOverdueDays());
            existing.setSemester(body.getSemester());
            existing.setPaymentStatus(body.getPaymentStatus());
            Fee saved = feeRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "FEE_RECORD_UPDATED", "fees", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Fee> processPayment(@PathVariable String id, @RequestBody Map<String, Object> payload, Authentication auth) {
        return feeRepo.findById(id).map(existing -> {
            Fee before = cloneFee(existing);
            double paymentAmount = Double.parseDouble(payload.getOrDefault("amount", "0").toString());
            double newPaid = existing.getPaid() + paymentAmount;
            existing.setPaid(newPaid);
            if (newPaid >= existing.getAmount()) {
                existing.setPaymentStatus("Paid");
                existing.setOverdueDays(0);
            } else if (newPaid > 0) {
                existing.setPaymentStatus("Partial");
            }
            Fee saved = feeRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "FEE_PAYMENT_PROCESSED", "fees", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        return feeRepo.findById(id).map(fee -> {
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "FEE_RECORD_DELETED", "fees", id, fee, null);
            feeRepo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private Fee cloneFee(Fee f) {
        Fee c = new Fee();
        c.setId(f.getId()); c.setStudentId(f.getStudentId()); c.setAmount(f.getAmount());
        c.setPaid(f.getPaid()); c.setPaymentStatus(f.getPaymentStatus());
        return c;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
