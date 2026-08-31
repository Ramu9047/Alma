package com.college.erp.repository;

import com.college.erp.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByEmail(String email);
    List<Student> findByDepartment(String department);
    List<Student> findByAttendancePercentLessThan(double threshold);
}
