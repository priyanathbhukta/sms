package com.education.sms.controller;

import com.education.sms.dto.AdminRequestRequest;
import com.education.sms.dto.AdminRequestResponse;
import com.education.sms.service.AdminRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-requests")
@RequiredArgsConstructor
public class AdminRequestController {

    private final AdminRequestService adminRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'LIBRARIAN')")
    public ResponseEntity<?> createAdminRequest(@RequestBody AdminRequestRequest request) {
        if (request.requesterUserId() == null || request.requestType() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            return ResponseEntity.ok(adminRequestService.createAdminRequest(request));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status,
            @RequestParam(required = false) String adminComments) {
        try {
            return ResponseEntity.ok(adminRequestService.updateStatus(requestId, status, adminComments));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(adminRequestService.getAllRequests());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'FACULTY', 'LIBRARIAN')")
    public ResponseEntity<List<AdminRequestResponse>> getRequestsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminRequestService.getRequestsByUser(userId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminRequestResponse>> getRequestsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(adminRequestService.getRequestsByStatus(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'FACULTY', 'LIBRARIAN')")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminRequestService.getRequestById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
