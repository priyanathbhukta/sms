package com.education.sms.dto;

import lombok.Data;

/**
 * Request DTO for updating student profile
 */
@Data
public class StudentProfileUpdateRequest {
    private String phone;
    private String address;
}
