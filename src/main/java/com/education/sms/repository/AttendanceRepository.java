package com.education.sms.repository;

import com.education.sms.dto.AttendanceResponse;
import com.education.sms.entity.Attendance;
import com.education.sms.entity.Student;
import com.education.sms.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // FIX: Add underscore (_) to separate Entity 'Student' from field 'Id'
    


    // This one usually works fine because it uses Entity objects directly
    boolean existsByStudentAndSubjectAndDate(Student student, Subject subject, LocalDate date);

    List<Attendance> findByStudentStudentIdAndSubjectId(Long studentId, Long subjectId);
    List<Attendance> findByStudentStudentId(Long studentId);
}