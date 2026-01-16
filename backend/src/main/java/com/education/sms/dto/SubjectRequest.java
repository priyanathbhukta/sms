package com.education.sms.dto;

public record SubjectRequest(
        String name,
        String code,
        Long classId,
        Long facultyId
) {
}
