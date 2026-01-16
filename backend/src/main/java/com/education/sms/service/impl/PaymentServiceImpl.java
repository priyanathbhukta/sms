package com.education.sms.service.impl;

import com.education.sms.dto.PaymentRequest;
import com.education.sms.dto.PaymentResponse;
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
import org.springframework.beans.factory.annotation.Value;
import org.json.JSONObject;
import com.razorpay.Utils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final AdminRequestRepository adminRequestRepository;

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
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

        // Verify signature if razorpay payment ID is present
        if (request.razorpayPaymentId() != null && !request.razorpayPaymentId().isEmpty()) {
            try {
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", request.razorpayOrderId());
                options.put("razorpay_payment_id", request.razorpayPaymentId());
                options.put("razorpay_signature", request.razorpaySignature());

                boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
                if (isValid) {
                    paymentBuilder.paymentStatus("success");
                } else {
                    paymentBuilder.paymentStatus("failed");
                }
            } catch (Exception e) {
                // Verification failed
                paymentBuilder.paymentStatus("failed");
            }
        }

        return toResponse(paymentRepository.save(paymentBuilder.build()));
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        payment.setPaymentStatus(status);
        return toResponse(paymentRepository.save(payment));
    }

    @Override
    public List<PaymentResponse> getPaymentsByStudent(Long studentId) {
        return paymentRepository.findByStudentStudentId(studentId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getPaymentsByStatus(String status) {
        return paymentRepository.findByPaymentStatus(status).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return toResponse(payment);
    }

    @Override
    public PaymentResponse getPaymentByRazorpayId(String razorpayPaymentId) {
        Payment payment = paymentRepository.findByRazorpayPaymentId(razorpayPaymentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found with Razorpay ID: " + razorpayPaymentId));
        return toResponse(payment);
    }

    private PaymentResponse toResponse(Payment entity) {
        Student student = entity.getStudent();
        AdminRequest adminRequest = entity.getAdminRequest();
        return new PaymentResponse(
                entity.getPaymentId(),
                student != null ? student.getStudentId() : null,
                student != null ? student.getFirstName() + " " + student.getLastName() : null,
                entity.getAmountPaid(),
                entity.getRazorpayPaymentId(),
                entity.getRazorpayOrderId(),
                entity.getPaymentStatus(),
                entity.getPaymentDate(),
                adminRequest != null ? adminRequest.getRequestId() : null);
    }
}
