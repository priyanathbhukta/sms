package com.education.sms.repository;

import com.education.sms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByClassEntityId(Long classId);

    List<Course> findByFacultyId(Long facultyId);

    boolean existsByCourseNameAndClassEntityId(String courseName, Long classId);
}
