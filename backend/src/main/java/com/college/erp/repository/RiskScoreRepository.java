package com.college.erp.repository;
import com.college.erp.model.RiskScore;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface RiskScoreRepository extends MongoRepository<RiskScore, String> {
    Optional<RiskScore> findByStudentId(String studentId);
}
