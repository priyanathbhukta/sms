package com.education.sms.controller;

import com.education.sms.dto.SubjectRequest;
import com.education.sms.dto.SubjectResponse;
import com.education.sms.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> createSubject(@RequestBody SubjectRequest request) {
        // Input Validation
        if (request.name() == null || request.name().isEmpty()) {
            return ResponseEntity.badRequest().body("Subject name is required");
        }
        if (request.code() == null || request.code().isEmpty()) {
            return ResponseEntity.badRequest().body("Subject code is required");
        }
        if (request.classId() == null || request.classId() <= 0) {
            return ResponseEntity.badRequest().body("Valid class ID is required");
        }
        if (request.facultyId() == null || request.facultyId() <= 0) {
            return ResponseEntity.badRequest().body("Valid faculty ID is required");
        }

        try {
            return ResponseEntity.ok(subjectService.createSubject(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> getSubjectById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(subjectService.getSubjectById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }
}
