package com.education.sms.dto;

public record CourseRequest(
        String courseName,
        Long classId,
        Long facultyId) {
}
