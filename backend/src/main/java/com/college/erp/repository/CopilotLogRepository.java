package com.college.erp.repository;
import com.college.erp.model.CopilotLog;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface CopilotLogRepository extends MongoRepository<CopilotLog, String> {}
