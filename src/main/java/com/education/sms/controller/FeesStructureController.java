package com.education.sms.controller;

import com.education.sms.dto.FeesStructureRequest;
import com.education.sms.dto.FeesStructureResponse;
import com.education.sms.service.FeesStructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeesStructureController {

    private final FeesStructureService feesStructureService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFeesStructure(@RequestBody FeesStructureRequest request) {
        if (request.classId() == null || request.amount() == null || request.feeType() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            return ResponseEntity.ok(feesStructureService.createFeesStructure(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<FeesStructureResponse>> getAllFeesStructures() {
        return ResponseEntity.ok(feesStructureService.getAllFeesStructures());
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<FeesStructureResponse>> getFeesStructuresByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(feesStructureService.getFeesStructuresByClass(classId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<?> getFeesStructureById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(feesStructureService.getFeesStructureById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFeesStructure(@PathVariable Long id) {
        try {
            feesStructureService.deleteFeesStructure(id);
            return ResponseEntity.ok("Fee structure deleted successfully");
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
