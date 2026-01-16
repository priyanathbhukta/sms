package com.education.sms.dto;

import java.math.BigDecimal;

public record FeesStructureRequest(
        Long classId,
        BigDecimal amount,
        String feeType) {
}
