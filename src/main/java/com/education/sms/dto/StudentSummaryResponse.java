package com.education.sms.dto;

/**
 * Lightweight student DTO for listings.
 */
public record StudentSummaryResponse(
        Long studentId,
        String firstName,
        String lastName,
        String fullName,
        String registrationNumber,
        String email,
        String className,
        String parentPhone) {
}
