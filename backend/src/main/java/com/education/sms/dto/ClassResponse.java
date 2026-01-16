package com.education.sms.dto;

public record ClassResponse(
        Long id,
        String gradeLevel,
        String section,
        String address,
        Integer academicYear) {
}
