package com.education.sms.dto;

import java.time.LocalDate;

public record AttendanceRequest(
        Long studentId,
        Long subjectId,
        LocalDate date,
        boolean isPresent
) {
}
