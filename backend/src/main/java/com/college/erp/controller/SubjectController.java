package com.college.erp.controller;

import com.college.erp.model.Subject;
import com.college.erp.repository.SubjectRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepo;
    private final AuditService auditService;

    public SubjectController(SubjectRepository subjectRepo, AuditService auditService) {
        this.subjectRepo = subjectRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Subject> getAll() {
        return subjectRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getById(@PathVariable String id) {
        return subjectRepo.findById(id).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Subject> create(@RequestBody Subject subject, Authentication auth) {
        Subject saved = subjectRepo.save(subject);
        auditService.log(auth != null ? auth.getName() : "system",
            extractRole(auth), "SUBJECT_CREATED", "subjects", saved.getId(), null, saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> update(@PathVariable String id, @RequestBody Subject body, Authentication auth) {
        return subjectRepo.findById(id).map(existing -> {
            Subject before = cloneSubject(existing);
            existing.setSubjectCode(body.getSubjectCode());
            existing.setName(body.getName());
            existing.setDepartment(body.getDepartment());
            existing.setCredits(body.getCredits());
            existing.setAssignedFacultyId(body.getAssignedFacultyId());
            Subject saved = subjectRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "SUBJECT_UPDATED", "subjects", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        return subjectRepo.findById(id).map(subject -> {
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "SUBJECT_DELETED", "subjects", id, subject, null);
            subjectRepo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private Subject cloneSubject(Subject s) {
        Subject c = new Subject();
        c.setId(s.getId()); c.setSubjectCode(s.getSubjectCode()); c.setName(s.getName());
        c.setDepartment(s.getDepartment()); c.setCredits(s.getCredits());
        return c;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
