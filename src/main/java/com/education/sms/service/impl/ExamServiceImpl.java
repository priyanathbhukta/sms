package com.education.sms.service.impl;

import com.education.sms.dto.ExamRequest;
import com.education.sms.dto.ExamResponse;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public ExamResponse createExam(ExamRequest request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.courseId()));

        Exam exam = Exam.builder()
                .course(course)
                .examName(request.examName())
                .date(request.date())
                .totalMarks(request.totalMarks())
                .build();

        return toResponse(examRepository.save(exam));
    }

    @Override
    public List<ExamResponse> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamResponse> getExamsByCourse(Long courseId) {
        return examRepository.findByCourseCourseId(courseId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamResponse> getExamsByClass(Long classId) {
        return examRepository.findByCourse_ClassEntityId(classId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ExamResponse getExamById(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));
        return toResponse(exam);
    }

    private ExamResponse toResponse(Exam entity) {
        Course course = entity.getCourse();
        return new ExamResponse(
                entity.getExamId(),
                course != null ? course.getCourseId() : null,
                course != null ? course.getCourseName() : null,
                entity.getExamName(),
                entity.getDate(),
                entity.getTotalMarks());
    }
}
