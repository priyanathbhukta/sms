package com.education.sms.controller;

import com.education.sms.dto.SubjectRequest;
import com.education.sms.dto.SubjectResponse;
import com.education.sms.entity.Subject;
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
    public ResponseEntity<Subject> createSubject(@RequestBody SubjectRequest request) {
        // Input Validation
        if (request.name() == null || request.name().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (request.code() == null || request.code().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (request.classId() == null || request.classId() <= 0) {
            return ResponseEntity.badRequest().body(null);
        }
        if (request.facultyId() == null || request.facultyId() <= 0) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            return ResponseEntity.ok(subjectService.createSubject(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }
}
