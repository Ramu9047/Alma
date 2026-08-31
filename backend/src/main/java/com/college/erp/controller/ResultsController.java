package com.college.erp.controller;

import com.college.erp.model.Student;
import com.college.erp.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/student/results")
public class ResultsController {

    private final StudentRepository studentRepo;

    public ResultsController(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getResults(Authentication auth) {
        List<Student> students;
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"))) {
            Optional<Student> me = studentRepo.findByEmail(auth.getName());
            students = me.map(List::of).orElseGet(studentRepo::findAll);
        } else {
            students = studentRepo.findAll();
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (Student s : students) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("studentId", s.getStudentId());
            map.put("studentName", s.getName());
            map.put("department", s.getDepartment());
            map.put("gpa", s.getGpa());
            map.put("backlogs", s.getBacklogs());
            map.put("semester", "Spring 2026");
            map.put("status", s.getBacklogs() == 0 ? "PASSED" : "CONDITIONAL");
            list.add(map);
        }
        return ResponseEntity.ok(list);
    }
}
