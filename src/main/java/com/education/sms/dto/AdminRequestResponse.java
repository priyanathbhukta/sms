package com.education.sms.dto;

import java.time.LocalDateTime;

public record AdminRequestResponse(
        Long requestId,
        Long requesterUserId,
        String requesterEmail,
        String requestType,
        String description,
        LocalDateTime previousDate,
        LocalDateTime newDate,
        String requestDocumentUrl,
        String status,
        String adminComments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
