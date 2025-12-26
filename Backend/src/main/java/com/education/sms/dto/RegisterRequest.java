package com.education.sms.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role; // ADMIN, STUDENT, FACULTY

    // For Students/Faculty
    private String additionalId; // rollNumberLast4 OR facultyId3
    private String department; // For Faculty
}
