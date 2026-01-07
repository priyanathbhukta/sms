package com.education.sms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for librarian to approve/reject book requests.
 */
public record BookRequestActionDTO(
        @NotNull(message = "Request ID is required") Long requestId,

        @NotBlank(message = "Action is required (APPROVE/REJECT)") String action, // APPROVE, REJECT

        String remarks) {
}
