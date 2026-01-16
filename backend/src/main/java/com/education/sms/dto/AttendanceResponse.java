package com.education.sms.dto;

import java.time.LocalDate;

public record AttendanceResponse(
        Long attendanceId,
        LocalDate date,
        Boolean isPresent,
        Long subjectId,
        String subjectName
) {

}
