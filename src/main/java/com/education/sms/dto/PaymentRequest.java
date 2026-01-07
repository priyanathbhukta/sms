package com.education.sms.dto;

import java.math.BigDecimal;

public record PaymentRequest(
                Long studentId,
                BigDecimal amountPaid,
                String razorpayPaymentId,
                String razorpayOrderId,
                Long adminRequestId,
                String razorpaySignature) {
}
