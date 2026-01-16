package com.education.sms.dto;

import lombok.Data;

/**
 * Request DTO for updating faculty information (admin use).
 */
@Data
public class FacultyUpdateRequest {
    private String firstName;
    private String lastName;
    private String department;
    private String phone;
}
