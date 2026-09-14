package com.college.erp.repository;

import com.college.erp.model.Result;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ResultRepository extends MongoRepository<Result, String> {
    List<Result> findBySubjectCode(String subjectCode);
    List<Result> findByStudentId(String studentId);
    Optional<Result> findByStudentIdAndSubjectCode(String studentId, String subjectCode);
}
