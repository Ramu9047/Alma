package com.college.erp.repository;
import com.college.erp.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findByActorUsernameOrderByTimestampDesc(String actorUsername);
    List<AuditLog> findByCollectionNameOrderByTimestampDesc(String collectionName);
}
