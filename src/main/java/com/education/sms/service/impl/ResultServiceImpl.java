package com.education.sms.service.impl;

import com.education.sms.dto.ResultRequest;
import com.education.sms.dto.ResultResponse;
import com.education.sms.entity.Exam;
import com.education.sms.entity.Result;
import com.education.sms.entity.Student;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.ExamRepository;
import com.education.sms.repository.ResultRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final ExamRepository examRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public Result createOrUpdateResult(ResultRequest request) {
        Exam exam = examRepository.findById(request.examId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + request.examId()));

        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.studentId()));

        // Check if result already exists
        Result result = resultRepository.findByExamExamIdAndStudentStudentId(request.examId(), request.studentId())
                .orElse(null);

        if (result != null) {
            // Update existing result (only if not finalized)
            if (Boolean.TRUE.equals(result.getIsFinalized())) {
                throw new IllegalStateException("Cannot update finalized result");
            }
            result.setMarksObtained(request.marksObtained());
        } else {
            // Create new result
            result = Result.builder()
                    .exam(exam)
                    .student(student)
                    .marksObtained(request.marksObtained())
                    .build();
        }

        return resultRepository.save(result);
    }

    @Override
    public List<ResultResponse> getResultsByStudent(Long studentId) {
        List<Result> results = resultRepository.findByStudentStudentId(studentId);
        return results.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ResultResponse> getResultsByExam(Long examId) {
        List<Result> results = resultRepository.findByExamExamId(examId);
        return results.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ResultResponse getResultByExamAndStudent(Long examId, Long studentId) {
        Result result = resultRepository.findByExamExamIdAndStudentStudentId(examId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Result not found for exam: " + examId + " and student: " + studentId));
        return mapToResponse(result);
    }

    @Override
    @Transactional
    public void finalizeResult(Long resultId) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + resultId));

        result.setIsFinalized(true);
        resultRepository.save(result);
    }

    private ResultResponse mapToResponse(Result result) {
        return new ResultResponse(
                result.getResultId(),
                result.getExam().getExamId(),
                result.getExam().getExamName(),
                result.getStudent().getStudentId(),
                result.getStudent().getFirstName() + " " + result.getStudent().getLastName(),
                result.getMarksObtained(),
                result.getExam().getTotalMarks(),
                result.getIsFinalized(),
                result.getCreatedAt());
    }
}
