package com.education.sms.controller;

import com.education.sms.dto.ResultRequest;
import com.education.sms.dto.ResultResponse;
import com.education.sms.entity.Result;
import com.education.sms.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<?> createOrUpdateResult(@RequestBody ResultRequest request) {
        if (request.examId() == null || request.studentId() == null || request.marksObtained() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            Result result = resultService.createOrUpdateResult(request);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<ResultResponse>> getResultsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<ResultResponse>> getResultsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.getResultsByExam(examId));
    }

    @GetMapping("/exam/{examId}/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<?> getResultByExamAndStudent(
            @PathVariable Long examId,
            @PathVariable Long studentId) {
        try {
            ResultResponse result = resultService.getResultByExamAndStudent(examId, studentId);
            return ResponseEntity.ok(result);
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{resultId}/finalize")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> finalizeResult(@PathVariable Long resultId) {
        try {
            resultService.finalizeResult(resultId);
            return ResponseEntity.ok("Result finalized successfully");
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
