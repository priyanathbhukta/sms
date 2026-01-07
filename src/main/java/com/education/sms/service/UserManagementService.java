package com.education.sms.service;

import com.education.sms.dto.*;
import org.springframework.data.domain.Pageable;

/**
 * Service for Admin user management operations.
 */
public interface UserManagementService {

    /**
     * Get all students with pagination.
     */
    PagedResponse<StudentSummaryResponse> getAllStudents(Pageable pageable);

    /**
     * Search students by name.
     */
    PagedResponse<StudentSummaryResponse> searchStudents(String name, Pageable pageable);

    /**
     * Get all faculty members with pagination.
     */
    PagedResponse<FacultySummaryResponse> getAllFaculty(Pageable pageable);

    /**
     * Search faculty by name.
     */
    PagedResponse<FacultySummaryResponse> searchFaculty(String name, Pageable pageable);

    /**
     * Get all librarians with pagination.
     */
    PagedResponse<LibrarianSummaryResponse> getAllLibrarians(Pageable pageable);

    /**
     * Get dashboard statistics for admin.
     */
    AdminDashboardStats getDashboardStats();
}
