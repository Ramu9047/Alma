package com.college.erp.controller;

import com.college.erp.model.Result;
import com.college.erp.model.Student;
import com.college.erp.repository.ResultRepository;
import com.college.erp.repository.StudentRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/results")
public class ResultsController {

    private final ResultRepository resultRepo;
    private final StudentRepository studentRepo;
    private final AuditService auditService;

    public ResultsController(ResultRepository resultRepo, StudentRepository studentRepo, AuditService auditService) {
        this.resultRepo = resultRepo;
        this.studentRepo = studentRepo;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<List<Result>> getResults(
            @RequestParam(required = false) String subjectCode,
            Authentication auth) {
        List<Result> results;

        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"))) {
            Optional<Student> me = studentRepo.findByEmail(auth.getName());
            if (me.isPresent()) {
                results = resultRepo.findByStudentId(me.get().getStudentId());
            } else {
                results = Collections.emptyList();
            }
        } else if (subjectCode != null && !subjectCode.trim().isEmpty()) {
            results = resultRepo.findBySubjectCode(subjectCode.trim());
        } else {
            results = resultRepo.findAll();
        }

        return ResponseEntity.ok(results);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(resultRepo.findByStudentId(studentId));
    }

    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> submitBulkResults(
            @RequestBody BulkResultRequest request,
            Authentication auth) {

        if (request.getRecords() == null || request.getRecords().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No result records provided"));
        }

        String subjectCode = request.getSubjectCode();
        String actor = auth != null ? auth.getName() : "system";
        String role = extractRole(auth);

        List<Result> savedResults = new ArrayList<>();

        for (ResultRecord rec : request.getRecords()) {
            Result result = resultRepo.findByStudentIdAndSubjectCode(rec.getStudentId(), subjectCode)
                    .orElseGet(Result::new);

            result.setStudentId(rec.getStudentId());
            result.setStudentName(rec.getStudentName());
            result.setSubjectCode(subjectCode);
            result.setInternal(rec.getInternal());
            result.setExternal(rec.getExternal());

            int total = rec.getInternal() + rec.getExternal();
            result.setTotal(total);
            result.setGrade(computeGrade(total));
            result.setStatus(total >= 50 ? "Pass" : "Fail");
            result.setEnteredBy(actor);
            result.setUpdatedAt(LocalDateTime.now().toString());

            savedResults.add(resultRepo.save(result));
        }

        auditService.log(actor, role, "RESULTS_SUBMITTED", "results", subjectCode, null,
                savedResults.size() + " marks records updated for subject " + subjectCode);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Successfully saved " + savedResults.size() + " result records");
        response.put("count", savedResults.size());
        response.put("results", savedResults);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(
            @PathVariable String id,
            @RequestBody Result body,
            Authentication auth) {

        return resultRepo.findById(id).map(existing -> {
            Result before = cloneResult(existing);
            existing.setInternal(body.getInternal());
            existing.setExternal(body.getExternal());

            int total = body.getInternal() + body.getExternal();
            existing.setTotal(total);
            existing.setGrade(computeGrade(total));
            existing.setStatus(total >= 50 ? "Pass" : "Fail");
            existing.setEnteredBy(auth != null ? auth.getName() : "system");
            existing.setUpdatedAt(LocalDateTime.now().toString());

            Result saved = resultRepo.save(existing);
            auditService.log(auth != null ? auth.getName() : "system",
                    extractRole(auth), "RESULT_UPDATED", "results", saved.getId(), before, saved);

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    private String computeGrade(int total) {
        if (total >= 90) return "O";
        if (total >= 80) return "A+";
        if (total >= 70) return "A";
        if (total >= 60) return "B+";
        if (total >= 50) return "B";
        return "F";
    }

    private Result cloneResult(Result r) {
        Result copy = new Result();
        copy.setId(r.getId());
        copy.setStudentId(r.getStudentId());
        copy.setStudentName(r.getStudentName());
        copy.setSubjectCode(r.getSubjectCode());
        copy.setInternal(r.getInternal());
        copy.setExternal(r.getExternal());
        copy.setTotal(r.getTotal());
        copy.setGrade(r.getGrade());
        copy.setStatus(r.getStatus());
        copy.setSemester(r.getSemester());
        copy.setEnteredBy(r.getEnteredBy());
        return copy;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }

    public static class BulkResultRequest {
        private String subjectCode;
        private List<ResultRecord> records;

        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
        public List<ResultRecord> getRecords() { return records; }
        public void setRecords(List<ResultRecord> records) { this.records = records; }
    }

    public static class ResultRecord {
        private String studentId;
        private String studentName;
        private int internal;
        private int external;

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public int getInternal() { return internal; }
        public void setInternal(int internal) { this.internal = internal; }
        public int getExternal() { return external; }
        public void setExternal(int external) { this.external = external; }
    }
}
