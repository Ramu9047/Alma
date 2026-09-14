package com.college.erp.repository;
import com.college.erp.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByDepartment(String department);
    Optional<Subject> findBySubjectCode(String subjectCode);
}
