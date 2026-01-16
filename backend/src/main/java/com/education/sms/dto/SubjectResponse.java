package com.education.sms.dto;

public record SubjectResponse (
        Long id,
        String name,
        String code,
        Long classId,
        Long facultyId
) {}
