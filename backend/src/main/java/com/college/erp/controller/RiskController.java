package com.college.erp.controller;

import com.college.erp.model.RiskScore;
import com.college.erp.repository.RiskScoreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/risk")
public class RiskController {

    private final RiskScoreRepository riskScoreRepo;

    public RiskController(RiskScoreRepository riskScoreRepo) {
        this.riskScoreRepo = riskScoreRepo;
    }

    @GetMapping
    public List<RiskScore> getAll() {
        return riskScoreRepo.findAll();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<RiskScore> getByStudentId(@PathVariable String studentId) {
        return riskScoreRepo.findByStudentId(studentId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
