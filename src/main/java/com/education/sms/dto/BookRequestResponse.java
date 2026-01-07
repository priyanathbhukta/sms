package com.education.sms.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for book requests.
 */
public record BookRequestResponse(
        Long requestId,
        Long studentId,
        String studentName,
        String studentRegistrationNumber,
        Long bookId,
        String bookTitle,
        String bookIsbn,
        String status,
        LocalDateTime requestDate,
        Long approvedById,
        String approvedByName,
        LocalDateTime approvedDate,
        String remarks,
        LocalDateTime createdAt) {
}
