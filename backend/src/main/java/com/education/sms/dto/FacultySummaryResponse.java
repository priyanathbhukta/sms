package com.education.sms.dto;

/**
 * Lightweight faculty DTO for listings.
 */
public record FacultySummaryResponse(
                Long facultyId,
                String firstName,
                String lastName,
                String fullName,
                String email,
                String department,
                String employeeId,
                String phone,
                String profileImageUrl) {
}
