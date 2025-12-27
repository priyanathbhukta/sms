package com.education.sms.repository;

import com.education.sms.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByCourseCourseId(Long courseId);

    List<Exam> findByCourse_ClassEntityId(Long classId);
}
