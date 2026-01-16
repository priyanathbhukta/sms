package com.education.sms.service;

import com.education.sms.dto.ExamRequest;
import com.education.sms.dto.ExamResponse;

import java.util.List;

public interface ExamService {

    ExamResponse createExam(ExamRequest request);

    List<ExamResponse> getAllExams();

    List<ExamResponse> getExamsByCourse(Long courseId);

    List<ExamResponse> getExamsByClass(Long classId);

    ExamResponse getExamById(Long examId);
}
