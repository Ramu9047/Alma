package com.college.erp.repository;

import com.college.erp.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByDateAndSessionSubjectCode(String date, String sessionSubjectCode);
    List<Attendance> findByStudentId(String studentId);
    Optional<Attendance> findByStudentIdAndDateAndSessionSubjectCode(String studentId, String date, String sessionSubjectCode);
}
