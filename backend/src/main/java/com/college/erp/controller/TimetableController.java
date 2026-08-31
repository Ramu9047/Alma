package com.college.erp.controller;

import com.college.erp.model.Timetable;
import com.college.erp.repository.TimetableRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/timetable")
public class TimetableController {

    private final TimetableRepository timetableRepo;
    private final AuditService auditService;

    public TimetableController(TimetableRepository timetableRepo, AuditService auditService) {
        this.timetableRepo = timetableRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Timetable> getAll() {
        return timetableRepo.findAll();
    }

    @GetMapping("/department/{dept}")
    public List<Timetable> getByDept(@PathVariable String dept) {
        return timetableRepo.findByDepartment(dept);
    }

    @PostMapping
    public ResponseEntity<Timetable> create(@RequestBody Timetable entry, Authentication auth) {
        Timetable saved = timetableRepo.save(entry);
        auditService.log(auth != null ? auth.getName() : "system",
            extractRole(auth), "TIMETABLE_ENTRY_CREATED", "timetables", saved.getId(), null, saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Timetable> update(@PathVariable String id, @RequestBody Timetable body, Authentication auth) {
        return timetableRepo.findById(id).map(existing -> {
            Timetable before = cloneTimetable(existing);
            existing.setDepartment(body.getDepartment());
            existing.setDay(body.getDay());
            existing.setTimeSlot(body.getTimeSlot());
            existing.setSubjectCode(body.getSubjectCode());
            existing.setFacultyId(body.getFacultyId());
            existing.setRoom(body.getRoom());
            Timetable saved = timetableRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "TIMETABLE_ENTRY_UPDATED", "timetables", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        return timetableRepo.findById(id).map(entry -> {
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "TIMETABLE_ENTRY_DELETED", "timetables", id, entry, null);
            timetableRepo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private Timetable cloneTimetable(Timetable t) {
        Timetable c = new Timetable();
        c.setId(t.getId()); c.setDepartment(t.getDepartment()); c.setDay(t.getDay());
        c.setTimeSlot(t.getTimeSlot()); c.setSubjectCode(t.getSubjectCode());
        return c;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
