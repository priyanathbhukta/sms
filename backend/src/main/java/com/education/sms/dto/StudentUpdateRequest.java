package com.education.sms.dto;

import lombok.Data;

/**
 * Request DTO for updating student information (admin use).
 */
@Data
public class StudentUpdateRequest {
    private String firstName;
    private String lastName;
    private Long classId;
    private String parentPhone;
    private String address;
}
