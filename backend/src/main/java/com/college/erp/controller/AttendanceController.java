package com.college.erp.controller;

import com.college.erp.model.Attendance;
import com.college.erp.model.Student;
import com.college.erp.repository.AttendanceRepository;
import com.college.erp.repository.StudentRepository;
import com.college.erp.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepo;
    private final StudentRepository studentRepo;
    private final AuditService auditService;

    public AttendanceController(AttendanceRepository attendanceRepo, StudentRepository studentRepo, AuditService auditService) {
        this.attendanceRepo = attendanceRepo;
        this.studentRepo = studentRepo;
        this.auditService = auditService;
    }

    public static class AttendanceRecordItem {
        private String studentId;
        private boolean present;

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public boolean isPresent() { return present; }
        public void setPresent(boolean present) { this.present = present; }
    }

    public static class BulkAttendanceRequest {
        private String date;
        private String subjectCode;
        private List<AttendanceRecordItem> records;

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
        public List<AttendanceRecordItem> getRecords() { return records; }
        public void setRecords(List<AttendanceRecordItem> records) { this.records = records; }
    }

    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> submitBulkAttendance(@RequestBody BulkAttendanceRequest payload, Authentication auth) {
        String markedBy = auth != null ? auth.getName() : "system";
        String date = payload.getDate();
        String subjectCode = payload.getSubjectCode();
        List<AttendanceRecordItem> items = payload.getRecords() != null ? payload.getRecords() : Collections.emptyList();

        List<Attendance> savedList = new ArrayList<>();
        for (AttendanceRecordItem item : items) {
            Optional<Attendance> existing = attendanceRepo.findByStudentIdAndDateAndSessionSubjectCode(item.getStudentId(), date, subjectCode);
            Attendance record;
            if (existing.isPresent()) {
                record = existing.get();
                record.setPresent(item.isPresent());
                record.setMarkedBy(markedBy);
            } else {
                record = new Attendance(item.getStudentId(), date, subjectCode, item.isPresent(), markedBy);
            }
            savedList.add(attendanceRepo.save(record));
        }

        auditService.log(
            markedBy,
            extractRole(auth),
            "ATTENDANCE_BULK_SUBMIT",
            "attendance",
            date + "_" + subjectCode,
            null,
            Map.of("date", date, "subjectCode", subjectCode, "count", savedList.size())
        );

        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "date", date,
            "subjectCode", subjectCode,
            "updatedRecords", savedList.size()
        ));
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getRegister(
            @RequestParam("date") String date,
            @RequestParam("subjectCode") String subjectCode) {
        List<Attendance> list = attendanceRepo.findByDateAndSessionSubjectCode(date, subjectCode);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<Map<String, Object>> getStudentSummary(@PathVariable String studentId) {
        return ResponseEntity.ok(computeSummaryForStudent(studentId));
    }

    @GetMapping("/me/summary")
    public ResponseEntity<?> getMySummary(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        String username = auth.getName();
        Optional<Student> studentOpt = studentRepo.findByStudentId(username)
            .or(() -> studentRepo.findByEmail(username));
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "No student record linked to this account"));
        }
        String studentId = studentOpt.get().getStudentId();
        return ResponseEntity.ok(computeSummaryForStudent(studentId));
    }

    private Map<String, Object> computeSummaryForStudent(String studentId) {
        List<Attendance> records = attendanceRepo.findByStudentId(studentId);
        int totalSessions = records.size();
        long presentCount = records.stream().filter(Attendance::isPresent).count();
        double attendancePercent = totalSessions > 0 ? (presentCount * 100.0 / totalSessions) : 100.0;
        attendancePercent = Math.round(attendancePercent * 10.0) / 10.0;

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("studentId", studentId);
        res.put("totalSessions", totalSessions);
        res.put("presentCount", presentCount);
        res.put("absentCount", totalSessions - presentCount);
        res.put("attendancePercent", attendancePercent);
        return res;
    }

    private String extractRole(Authentication auth) {
        if (auth == null) return "UNKNOWN";
        return auth.getAuthorities().stream().findFirst()
            .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("UNKNOWN");
    }
}
