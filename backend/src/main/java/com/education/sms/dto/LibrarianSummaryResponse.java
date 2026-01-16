package com.education.sms.dto;

/**
 * Lightweight librarian DTO for listings.
 */
public record LibrarianSummaryResponse(
        Long id,
        Long librarianId,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String employeeId,
        String phone,
        String profileImageUrl) {
}
