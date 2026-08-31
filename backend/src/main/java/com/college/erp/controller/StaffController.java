package com.college.erp.controller;

import com.college.erp.model.Staff;
import com.college.erp.repository.StaffRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffRepository staffRepo;
    private final AuditService auditService;

    public StaffController(StaffRepository staffRepo, AuditService auditService) {
        this.staffRepo = staffRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Staff> getAll() {
        return staffRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getById(@PathVariable String id) {
        return staffRepo.findById(id).map(ResponseEntity::ok)
            .orElseGet(() -> staffRepo.findByStaffId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()));
    }

    @PostMapping
    public ResponseEntity<Staff> create(@RequestBody Staff staff, Authentication auth) {
        if (staffRepo.findByStaffId(staff.getStaffId()).isPresent()) {
            return ResponseEntity.status(409).build();
        }
        Staff saved = staffRepo.save(staff);
        auditService.log(auth != null ? auth.getName() : "system",
            extractRole(auth), "STAFF_CREATED", "staff", saved.getId(), null, saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> update(@PathVariable String id, @RequestBody Staff body, Authentication auth) {
        return staffRepo.findById(id).map(existing -> {
            Staff before = cloneStaff(existing);
            existing.setName(body.getName());
            existing.setEmail(body.getEmail());
            existing.setDepartment(body.getDepartment());
            existing.setDesignation(body.getDesignation());
            existing.setAssignedCourses(body.getAssignedCourses());
            existing.setPhone(body.getPhone());
            Staff saved = staffRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "STAFF_UPDATED", "staff", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        return staffRepo.findById(id).map(staff -> {
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "STAFF_DELETED", "staff", id, staff, null);
            staffRepo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private Staff cloneStaff(Staff s) {
        Staff c = new Staff();
        c.setId(s.getId()); c.setStaffId(s.getStaffId()); c.setName(s.getName());
        c.setEmail(s.getEmail()); c.setDepartment(s.getDepartment());
        c.setDesignation(s.getDesignation());
        return c;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
