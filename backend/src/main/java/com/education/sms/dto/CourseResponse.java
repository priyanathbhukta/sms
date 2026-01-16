package com.education.sms.dto;

public record CourseResponse(
        Long courseId,
        String courseName,
        Long classId,
        String className,
        Long facultyId,
        String facultyName) {
}
