package com.college.erp.repository;
import com.college.erp.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface StaffRepository extends MongoRepository<Staff, String> {
    Optional<Staff> findByStaffId(String staffId);
    Optional<Staff> findByEmail(String email);
}
