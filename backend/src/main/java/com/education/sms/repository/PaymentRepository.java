package com.education.sms.repository;

import com.education.sms.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStudentStudentId(Long studentId);

    List<Payment> findByPaymentStatus(String paymentStatus);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    List<Payment> findByStudentStudentIdAndPaymentStatus(Long studentId, String paymentStatus);
}
