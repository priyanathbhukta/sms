package com.education.sms.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ResultResponse(
        Long resultId,
        Long examId,
        String examName,
        Long studentId,
        String studentName,
        BigDecimal marksObtained,
        Integer totalMarks,
        Boolean isFinalized,
        LocalDateTime createdAt) {
}
