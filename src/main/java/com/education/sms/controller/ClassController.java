package com.education.sms.controller;

import com.education.sms.dto.ClassRequest;
import com.education.sms.dto.ClassResponse;
import com.education.sms.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createClass(@RequestBody ClassRequest request) {
        // Input Validation
        if (request.gradeLevel() == null || request.gradeLevel().isEmpty()) {
            return ResponseEntity.badRequest().body("Grade level is required");
        }
        if (request.section() == null || request.section().isEmpty()) {
            return ResponseEntity.badRequest().body("Section is required");
        }
        if (request.academicYear() == null || request.academicYear() <= 0) {
            return ResponseEntity.badRequest().body("Academic year must be valid");
        }

        try {
            return ResponseEntity.ok(classService.createClass(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Get All Classes (Admin and Faculty)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    // 3. Get Class by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<?> getClassById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(classService.getClassById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. Assign Student to Class (Admin Only)
    @PutMapping("/{classId}/students/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignStudentToClass(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        try {
            classService.assignStudentToClass(studentId, classId);
            return ResponseEntity.ok("Student assigned to class successfully.");
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
