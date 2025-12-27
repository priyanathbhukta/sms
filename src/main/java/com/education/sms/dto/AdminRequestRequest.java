package com.education.sms.dto;

import java.time.LocalDateTime;

public record AdminRequestRequest(
        Long requesterUserId,
        String requestType,
        String description,
        LocalDateTime previousDate,
        LocalDateTime newDate,
        String requestDocumentUrl) {
}
