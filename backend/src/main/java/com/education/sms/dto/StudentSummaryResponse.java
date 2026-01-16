package com.education.sms.dto;

/**
 * Lightweight student DTO for listings.
 */
public record StudentSummaryResponse(
                Long id,
                Long studentId,
                String firstName,
                String lastName,
                String fullName,
                String registrationNumber,
                String email,
                String enrollmentYear,
                String className,
                Long classId,
                String parentPhone,
                String address) {
}
