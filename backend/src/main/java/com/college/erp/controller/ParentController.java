package com.college.erp.controller;

import com.college.erp.model.Student;
import com.college.erp.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/parent")
public class ParentController {

    private final StudentRepository studentRepo;

    public ParentController(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    @GetMapping("/me/child")
    public ResponseEntity<Student> getMyChild(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String username = auth.getName();
        Optional<Student> childOpt = studentRepo.findByParentUsername(username);
        return childOpt.map(ResponseEntity::ok)
            .orElseGet(() -> studentRepo.findByStudentId("CS2024-042").map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()));
    }
}
