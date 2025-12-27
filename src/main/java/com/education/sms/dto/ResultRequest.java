package com.education.sms.dto;

import java.math.BigDecimal;

public record ResultRequest(
        Long examId,
        Long studentId,
        BigDecimal marksObtained) {
}
