package com.college.erp.repository;
import com.college.erp.model.Fee;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface FeeRepository extends MongoRepository<Fee, String> {
    List<Fee> findByStudentId(String studentId);
    List<Fee> findByPaymentStatus(String paymentStatus);
    List<Fee> findByOverdueDaysGreaterThan(int days);
}
