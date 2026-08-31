package com.college.erp.repository;
import com.college.erp.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findByCourseCode(String courseCode);
}
