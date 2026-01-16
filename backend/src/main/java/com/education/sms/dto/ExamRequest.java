package com.education.sms.dto;

import java.time.LocalDate;

public record ExamRequest(
        Long courseId,
        String examName,
        LocalDate date,
        Integer totalMarks) {
}
