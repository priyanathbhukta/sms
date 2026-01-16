package com.education.sms.dto;

/**
 * Summary of a class for dashboard.
 */
public record ClassSummary(
        Long classId,
        String gradeLevel,
        String section,
        long studentCount) {
}
