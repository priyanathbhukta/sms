package com.education.sms.dto;

/**
 * Dashboard statistics for Admin.
 */
public record AdminDashboardStats(
        long totalStudents,
        long totalFaculty,
        long totalLibrarians,
        long pendingAdminRequests,
        long pendingBookRequests,
        long totalClasses,
        long totalCourses) {
}
