package com.education.sms.dto;

import java.time.LocalDate;

public record ExamResponse(
        Long examId,
        Long courseId,
        String courseName,
        String examName,
        LocalDate date,
        Integer totalMarks) {
}
