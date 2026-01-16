package com.education.sms.dto;

/**
 * Summary record for subject data returned in faculty dashboard
 */
public record SubjectSummary(
        Long id,
        String name,
        String code,
        Long classId,
        String className) {
}
