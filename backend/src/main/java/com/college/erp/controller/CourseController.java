package com.college.erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCourses() {
        List<Map<String, Object>> courses = List.of(
            Map.of("id", "crs_101", "code", "CSE-BS", "name", "B.Tech Computer Science & Engineering", "department", "CSE", "durationYears", 4, "status", "Active"),
            Map.of("id", "crs_102", "code", "ECE-BS", "name", "B.Tech Electronics & Communication", "department", "ECE", "durationYears", 4, "status", "Active"),
            Map.of("id", "crs_103", "code", "MECH-BS", "name", "B.Tech Mechanical Engineering", "department", "MECH", "durationYears", 4, "status", "Active")
        );
        return ResponseEntity.ok(courses);
    }
}
