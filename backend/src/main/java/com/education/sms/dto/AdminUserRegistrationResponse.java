package com.education.sms.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO for admin user registration response
 */
@Data
@Builder
public class AdminUserRegistrationResponse {

    private Long userId;
    private String generatedEmail; // System email (xxx@sms.edu.in)
    private String personalEmail;
    private String role;
    private String firstName;
    private String lastName;
    private String message;
    private boolean emailSent;
}
