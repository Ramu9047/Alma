package com.college.erp.repository;
import com.college.erp.model.Leave;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
public interface LeaveRepository extends MongoRepository<Leave, String> {
    Optional<Leave> findByLeaveId(String leaveId);
    List<Leave> findByStatus(String status);
    List<Leave> findByApplicantUsername(String applicantUsername);
}
