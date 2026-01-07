package com.education.sms.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long paymentId,
        Long studentId,
        String studentName,
        BigDecimal amountPaid,
        String razorpayPaymentId,
        String razorpayOrderId,
        String paymentStatus,
        LocalDateTime paymentDate,
        Long adminRequestId) {
}
