package com.education.sms.dto;

import java.time.LocalDate;

public record EventRequest(
        String title,
        LocalDate eventDate,
        String description) {
}
