package com.education.sms.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a book request.
 */
public record BookRequestCreateDTO(
        @NotNull(message = "Student ID is required") Long studentId,

        @NotNull(message = "Book ID is required") Long bookId,

        String remarks) {
}
