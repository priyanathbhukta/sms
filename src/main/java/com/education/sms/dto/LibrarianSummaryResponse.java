package com.education.sms.dto;

/**
 * Lightweight librarian DTO for listings.
 */
public record LibrarianSummaryResponse(
        Long librarianId,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String employeeId) {
}
