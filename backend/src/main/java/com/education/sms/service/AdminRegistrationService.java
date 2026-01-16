package com.education.sms.service;

import com.education.sms.dto.AdminUserRegistrationRequest;
import com.education.sms.dto.AdminUserRegistrationResponse;

/**
 * Service for admin-only user registration
 */
public interface AdminRegistrationService {

    /**
     * Register a new student (Admin only)
     */
    AdminUserRegistrationResponse registerStudent(AdminUserRegistrationRequest request);

    /**
     * Register a new faculty member (Admin only)
     */
    AdminUserRegistrationResponse registerFaculty(AdminUserRegistrationRequest request);

    /**
     * Register a new librarian (Admin only)
     */
    AdminUserRegistrationResponse registerLibrarian(AdminUserRegistrationRequest request);

    /**
     * Register a new admin (Admin only)
     */
    AdminUserRegistrationResponse registerAdmin(AdminUserRegistrationRequest request);

    /**
     * Generate a secure temporary password
     */
    String generateTemporaryPassword();
}
