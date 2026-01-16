package com.education.sms.service;

/**
 * Service interface for sending emails
 */
public interface EmailService {

    /**
     * Send login credentials to a newly registered user
     *
     * @param to           Personal email address of the user
     * @param systemEmail  System email (xxx@sms.edu.in) for login
     * @param tempPassword Temporary password
     * @param role         User's role (STUDENT, FACULTY, LIBRARIAN)
     * @param firstName    User's first name
     */
    void sendCredentialsEmail(String to, String systemEmail, String tempPassword, String role, String firstName);

    /**
     * Send password reset link to user
     *
     * @param to         Personal email address
     * @param resetToken Password reset token
     * @param firstName  User's first name
     */
    void sendPasswordResetEmail(String to, String resetToken, String firstName);

    /**
     * Send notification that password was changed successfully
     *
     * @param to        Personal email address
     * @param firstName User's first name
     */
    void sendPasswordChangedNotification(String to, String firstName);
}
