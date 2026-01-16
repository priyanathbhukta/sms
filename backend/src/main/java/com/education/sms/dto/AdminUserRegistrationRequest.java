package com.education.sms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for admin user registration request
 */
@Data
public class AdminUserRegistrationRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Personal email is required")
    @Email(message = "Invalid email format")
    private String personalEmail; // Real email for sending credentials

    // Role is optional - determined by the endpoint URL (student/faculty/librarian)
    private String role;

    // Optional fields based on role
    private String department; // For FACULTY
    private String additionalId; // Roll number year (STUDENT) / Employee ID (FACULTY/LIBRARIAN)
    private String phone; // Optional phone number
    private Long classId; // For STUDENT - Class to assign student to
}
