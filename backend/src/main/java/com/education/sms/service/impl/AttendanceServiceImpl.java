package com.education.sms.service.impl;

import com.education.sms.dto.AttendanceRequest;
import com.education.sms.dto.AttendanceResponse;
import com.education.sms.entity.Attendance;
import com.education.sms.entity.Student;
import com.education.sms.entity.Subject;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.AttendanceRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.repository.SubjectRepository;
import com.education.sms.service.AttendanceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    @Override
    @Transactional
    public String markAttendance(AttendanceRequest request) {
        // ... (Previous logic remains the same) ...
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        // Use getId() here (Fixed in previous step)
        if (!student.getClassEntity().getId().equals(subject.getClassEntity().getId())) {
            throw new IllegalArgumentException("Student does not belong to the class where this subject is taught.");
        }

        if (attendanceRepository.existsByStudentAndSubjectAndDate(student, subject, request.date())) {
            throw new IllegalArgumentException("Attendance already marked for this date.");
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .subject(subject)
                .date(request.date())
                .isPresent(request.isPresent())
                .build();

        attendanceRepository.save(attendance);
        return "Attendance marked successfully";
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudentId(Long studentId) {
        List<Attendance> attendanceList = attendanceRepository.findByStudentStudentId(studentId);
        return attendanceList.stream()
                .map(attendance -> new AttendanceResponse(
                        attendance.getId(),
                        attendance.getDate(),
                        attendance.isPresent(),
                        attendance.getSubject().getId(),
                        attendance.getSubject().getName()
                ))
                .toList();
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudentAndSubjectId(Long studentId, Long  subjectId) {
        // FIX: Call the method with the underscore
        List<Attendance> attendanceList =
                attendanceRepository.findByStudentStudentIdAndSubjectId(studentId, subjectId);

        return attendanceList.stream()
                .map(attendance -> new AttendanceResponse(
                        attendance.getId(),
                        attendance.getDate(),
                        attendance.isPresent(),
                        attendance.getSubject().getId(),
                        attendance.getSubject().getName()
                ))
                .toList();
    }
}