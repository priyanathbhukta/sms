package com.education.sms.controller;


import com.education.sms.dto.AttendanceRequest;
import com.education.sms.dto.AttendanceResponse;
import com.education.sms.entity.Attendance;
import com.education.sms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 1. Mark Attendance (Faculty Only)
    @PostMapping("/mark")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<String> markAttendance(@RequestBody AttendanceRequest request) {
        // Input Validation
        if (request.studentId() == null || request.studentId() <= 0) {
            return ResponseEntity.badRequest().body("Student ID must be valid");
        }
        if (request.subjectId() == null || request.subjectId() <= 0) {
            return ResponseEntity.badRequest().body("Subject ID must be valid");
        }
        if (request.date() == null) {
            return ResponseEntity.badRequest().body("Date cannot be null");
        }

        try {
            return ResponseEntity.ok(attendanceService.markAttendance(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. View Student Attendance (Student, Faculty, Admin)
    @GetMapping("/student/{studentId}/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudentSubjectId(
            @PathVariable Long studentId,
            @RequestParam Long subjectId
    ) {
        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudentAndSubjectId(studentId, subjectId)
        );
    }


    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudentId(
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudentId(studentId)
        );
    }
}
