package com.education.sms.service.impl;

import com.education.sms.dto.PaymentRequest;
import com.education.sms.entity.AdminRequest;
import com.education.sms.entity.Payment;
import com.education.sms.entity.Student;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.AdminRequestRepository;
import com.education.sms.repository.PaymentRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final AdminRequestRepository adminRequestRepository;

    @Override
    @Transactional
    public Payment createPayment(PaymentRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.studentId()));

        Payment.PaymentBuilder paymentBuilder = Payment.builder()
                .student(student)
                .amountPaid(request.amountPaid())
                .razorpayPaymentId(request.razorpayPaymentId())
                .razorpayOrderId(request.razorpayOrderId());

        // Optionally link to admin request
        if (request.adminRequestId() != null) {
            AdminRequest adminRequest = adminRequestRepository.findById(request.adminRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Admin request not found with id: " + request.adminRequestId()));
            paymentBuilder.adminRequest(adminRequest);
        }

        // Auto-set status to success if razorpay payment ID is present
        if (request.razorpayPaymentId() != null && !request.razorpayPaymentId().isEmpty()) {
            paymentBuilder.paymentStatus("success");
        }

        return paymentRepository.save(paymentBuilder.build());
    }

    @Override
    @Transactional
    public Payment updatePaymentStatus(Long paymentId, String status) {
        Payment payment = getPaymentById(paymentId);
        payment.setPaymentStatus(status);
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getPaymentsByStudent(Long studentId) {
        return paymentRepository.findByStudentStudentId(studentId);
    }

    @Override
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByPaymentStatus(status);
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
    }

    @Override
    public Payment getPaymentByRazorpayId(String razorpayPaymentId) {
        return paymentRepository.findByRazorpayPaymentId(razorpayPaymentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found with Razorpay ID: " + razorpayPaymentId));
    }
}
