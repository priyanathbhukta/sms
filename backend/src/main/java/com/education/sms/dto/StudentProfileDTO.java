package com.education.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for student profile view and update operations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDTO {
    private Long studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String registrationNumber;
    private String phone;
    private String parentPhone;
    private String address;
    private String profileImageUrl;
    private String className;
    private Long classId;
    private String gradeLevel;
    private String section;
    private Integer gamificationPoints;
}
