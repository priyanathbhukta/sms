package com.education.sms.service;

import com.education.sms.dto.PasswordChangeRequest;
import com.education.sms.dto.PasswordResetConfirm;
import com.education.sms.dto.PasswordResetRequest;

/**
 * Service for password management operations
 */
public interface PasswordService {

    /**
     * Change password for authenticated user
     *
     * @param email   User's email
     * @param request Password change request
     */
    void changePassword(String email, PasswordChangeRequest request);

    /**
     * Request password reset (sends email with token)
     *
     * @param request Password reset request containing email
     */
    void requestPasswordReset(PasswordResetRequest request);

    /**
     * Confirm password reset with token
     *
     * @param request Password reset confirmation with token and new password
     */
    void confirmPasswordReset(PasswordResetConfirm request);

    /**
     * Check if user must change password
     *
     * @param email User's email
     * @return true if password change is required
     */
    boolean mustChangePassword(String email);
}
