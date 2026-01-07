package com.education.sms.service;

import com.education.sms.dto.PaymentRequest;
import com.education.sms.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    PaymentResponse updatePaymentStatus(Long paymentId, String status);

    List<PaymentResponse> getPaymentsByStudent(Long studentId);

    List<PaymentResponse> getPaymentsByStatus(String status);

    PaymentResponse getPaymentById(Long paymentId);

    PaymentResponse getPaymentByRazorpayId(String razorpayPaymentId);
}
