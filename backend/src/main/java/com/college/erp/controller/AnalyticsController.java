package com.college.erp.controller;

import com.college.erp.model.Fee;
import com.college.erp.model.Student;
import com.college.erp.repository.FeeRepository;
import com.college.erp.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/analytics")
public class AnalyticsController {

    private final StudentRepository studentRepo;
    private final FeeRepository feeRepo;

    public AnalyticsController(StudentRepository studentRepo, FeeRepository feeRepo) {
        this.studentRepo = studentRepo;
        this.feeRepo = feeRepo;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<Student> students = studentRepo.findAll();
        List<Fee> fees = feeRepo.findAll();

        double avgAttendance = students.stream().mapToDouble(Student::getAttendancePercent).average().orElse(0.0);
        long passedCount = students.stream().filter(s -> s.getBacklogs() == 0).count();
        double passRate = students.isEmpty() ? 0.0 : ((double) passedCount / students.size()) * 100.0;

        double totalFeeAmount = fees.stream().mapToDouble(Fee::getAmount).sum();
        double totalFeePaid = fees.stream().mapToDouble(Fee::getPaid).sum();
        double feeRecovery = totalFeeAmount == 0 ? 0.0 : (totalFeePaid / totalFeeAmount) * 100.0;

        long atRiskCount = students.stream().filter(s -> s.getAttendancePercent() < 75.0).count();

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("totalStudents", students.size());
        res.put("avgAttendance", Math.round(avgAttendance * 10.0) / 10.0);
        res.put("passRate", Math.round(passRate * 10.0) / 10.0);
        res.put("feeRecovery", Math.round(feeRecovery * 10.0) / 10.0);
        res.put("totalFeeCollected", totalFeePaid);
        res.put("totalFeeOutstanding", totalFeeAmount - totalFeePaid);
        res.put("atRiskCount", atRiskCount);

        return ResponseEntity.ok(res);
    }
}
