package com.education.sms.service;

import com.education.sms.dto.ExamRequest;
import com.education.sms.entity.Exam;

import java.util.List;

public interface ExamService {

    Exam createExam(ExamRequest request);

    List<Exam> getAllExams();

    List<Exam> getExamsByCourse(Long courseId);

    List<Exam> getExamsByClass(Long classId);

    Exam getExamById(Long examId);
}
