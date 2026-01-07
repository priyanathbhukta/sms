package com.education.sms.dto;

import java.util.List;

/**
 * Dashboard statistics for Faculty.
 */
public record FacultyDashboardStats(
                long totalClasses,
                long totalStudents,
                long upcomingExams,
                long pendingResults,
                List<ClassSummary> myClasses) {
}
