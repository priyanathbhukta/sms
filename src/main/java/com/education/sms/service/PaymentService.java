package com.education.sms.service;

import com.education.sms.dto.PaymentRequest;
import com.education.sms.entity.Payment;

import java.util.List;

public interface PaymentService {

    Payment createPayment(PaymentRequest request);

    Payment updatePaymentStatus(Long paymentId, String status);

    List<Payment> getPaymentsByStudent(Long studentId);

    List<Payment> getPaymentsByStatus(String status);

    Payment getPaymentById(Long paymentId);

    Payment getPaymentByRazorpayId(String razorpayPaymentId);
}
