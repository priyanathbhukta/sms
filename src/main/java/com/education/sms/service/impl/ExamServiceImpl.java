package com.education.sms.service.impl;

import com.education.sms.dto.ExamRequest;
import com.education.sms.entity.Course;
import com.education.sms.entity.Exam;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.CourseRepository;
import com.education.sms.repository.ExamRepository;
import com.education.sms.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public Exam createExam(ExamRequest request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.courseId()));

        Exam exam = Exam.builder()
                .course(course)
                .examName(request.examName())
                .date(request.date())
                .totalMarks(request.totalMarks())
                .build();

        return examRepository.save(exam);
    }

    @Override
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Override
    public List<Exam> getExamsByCourse(Long courseId) {
        return examRepository.findByCourseCourseId(courseId);
    }

    @Override
    public List<Exam> getExamsByClass(Long classId) {
        return examRepository.findByCourse_ClassEntityId(classId);
    }

    @Override
    public Exam getExamById(Long examId) {
        return examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));
    }
}
