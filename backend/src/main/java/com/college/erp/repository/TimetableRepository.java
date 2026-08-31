package com.college.erp.repository;
import com.college.erp.model.Timetable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface TimetableRepository extends MongoRepository<Timetable, String> {
    List<Timetable> findByDepartment(String department);
    List<Timetable> findByDepartmentAndDay(String department, String day);
}
