package com.education.sms.dto;

import java.math.BigDecimal;

public record FeesStructureResponse(
        Long feeId,
        Long classId,
        String className,
        BigDecimal amount,
        String feeType) {
}
