package com.education.sms.dto;

import java.time.LocalDate;

public record EventResponse(
        Long eventId,
        String title,
        LocalDate eventDate,
        String description) {
}
