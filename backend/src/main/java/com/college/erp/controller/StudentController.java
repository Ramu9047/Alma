package com.college.erp.controller;

import com.college.erp.model.Student;
import com.college.erp.repository.StudentRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentRepository studentRepo;
    private final AuditService auditService;

    public StudentController(StudentRepository studentRepo, AuditService auditService) {
        this.studentRepo = studentRepo;
        this.auditService = auditService;
    }

    /** Any authenticated user with STUDENT/ADMIN_HOD/SUPER_ADMIN role (per SecurityConfig) */
    @GetMapping
    public List<Student> getAll() {
        return studentRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable String id) {
        return studentRepo.findById(id).map(ResponseEntity::ok)
            .orElseGet(() -> studentRepo.findByStudentId(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()));
    }

    @GetMapping("/me")
    public ResponseEntity<Student> getMe(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return studentRepo.findByEmail(auth.getName())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Student> create(@RequestBody Student student, Authentication auth) {
        if (studentRepo.findByStudentId(student.getStudentId()).isPresent()) {
            return ResponseEntity.status(409).build();   // conflict
        }
        Student saved = studentRepo.save(student);
        auditService.log(auth != null ? auth.getName() : "system",
            extractRole(auth), "STUDENT_CREATED", "students", saved.getId(), null, saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable String id,
                                          @RequestBody Student body, Authentication auth) {
        return studentRepo.findById(id).map(existing -> {
            Student before = cloneStudent(existing);
            existing.setName(body.getName());
            existing.setEmail(body.getEmail());
            existing.setDepartment(body.getDepartment());
            existing.setCourse(body.getCourse());
            existing.setBatch(body.getBatch());
            existing.setAttendancePercent(body.getAttendancePercent());
            existing.setGpa(body.getGpa());
            existing.setFeeStatus(body.getFeeStatus());
            existing.setBacklogs(body.getBacklogs());
            existing.setPhone(body.getPhone());
            existing.setParentEmail(body.getParentEmail());
            Student saved = studentRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "STUDENT_UPDATED", "students", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        return studentRepo.findById(id).map(student -> {
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "STUDENT_DELETED", "students", id, student, null);
            studentRepo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/at-risk")
    public List<Student> getAtRisk() {
        return studentRepo.findByAttendancePercentLessThan(75.0);
    }

    private Student cloneStudent(Student s) {
        Student c = new Student();
        c.setId(s.getId()); c.setStudentId(s.getStudentId()); c.setName(s.getName());
        c.setAttendancePercent(s.getAttendancePercent()); c.setGpa(s.getGpa());
        c.setFeeStatus(s.getFeeStatus()); c.setBacklogs(s.getBacklogs());
        return c;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
