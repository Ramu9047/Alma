package com.college.erp.controller;

import com.college.erp.model.Course;
import com.college.erp.repository.CourseRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepo;
    private final AuditService auditService;

    public CourseController(CourseRepository courseRepo, AuditService auditService) {
        this.courseRepo = courseRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Course> getAll() {
        return courseRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable String id) {
        return courseRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course, Authentication auth) {
        Course saved = courseRepo.save(course);
        auditService.log(auth != null ? auth.getName() : "system",
            extractRole(auth), "COURSE_CREATED", "courses", saved.getId(), null, saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable String id, @RequestBody Course body, Authentication auth) {
        return courseRepo.findById(id).map(existing -> {
            Course before = cloneCourse(existing);
            existing.setCourseCode(body.getCourseCode());
            existing.setName(body.getName());
            existing.setDepartment(body.getDepartment());
            existing.setDuration(body.getDuration());
            existing.setTotalSeats(body.getTotalSeats());
            existing.setEnrolledCount(body.getEnrolledCount());
            Course saved = courseRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "COURSE_UPDATED", "courses", saved.getId(), before, saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        return courseRepo.findById(id).map(course -> {
            auditService.log(auth != null ? auth.getName() : "system",
                extractRole(auth), "COURSE_DELETED", "courses", id, course, null);
            courseRepo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private Course cloneCourse(Course c) {
        Course copy = new Course();
        copy.setId(c.getId());
        copy.setCourseCode(c.getCourseCode());
        copy.setName(c.getName());
        copy.setDepartment(c.getDepartment());
        copy.setDuration(c.getDuration());
        copy.setTotalSeats(c.getTotalSeats());
        copy.setEnrolledCount(c.getEnrolledCount());
        return copy;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
