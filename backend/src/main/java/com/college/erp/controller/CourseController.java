package com.college.erp.controller;

import com.college.erp.model.Course;
import com.college.erp.repository.CourseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepo;

    public CourseController(CourseRepository courseRepo) {
        this.courseRepo = courseRepo;
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
    public Course create(@RequestBody Course course) {
        return courseRepo.save(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable String id, @RequestBody Course body) {
        return courseRepo.findById(id).map(existing -> {
            existing.setName(body.getName());
            existing.setDepartment(body.getDepartment());
            existing.setDuration(body.getDuration());
            existing.setTotalSeats(body.getTotalSeats());
            existing.setEnrolledCount(body.getEnrolledCount());
            return ResponseEntity.ok(courseRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!courseRepo.existsById(id)) return ResponseEntity.notFound().build();
        courseRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
