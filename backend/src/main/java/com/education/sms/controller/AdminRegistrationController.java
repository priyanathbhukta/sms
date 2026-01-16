package com.education.sms.controller;

import com.education.sms.dto.AdminUserRegistrationRequest;
import com.education.sms.dto.AdminUserRegistrationResponse;
import com.education.sms.service.AdminRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for admin-only user registration.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/api/admin/register")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - User Registration", description = "Admin-only endpoints for registering new users")
@Slf4j
public class AdminRegistrationController {

    private final AdminRegistrationService registrationService;

    @PostMapping("/student")
    @Operation(summary = "Register a new student", description = "Admin creates a student account. Credentials are sent to personal email.")
    public ResponseEntity<AdminUserRegistrationResponse> registerStudent(
            @Valid @RequestBody AdminUserRegistrationRequest request) {
        try {
            log.info("Admin registering new student: {} {}", request.getFirstName(), request.getLastName());
            AdminUserRegistrationResponse response = registrationService.registerStudent(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Student registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    AdminUserRegistrationResponse.builder()
                            .message(e.getMessage())
                            .emailSent(false)
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error during student registration: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    AdminUserRegistrationResponse.builder()
                            .message("An unexpected error occurred: " + e.getMessage())
                            .emailSent(false)
                            .build());
        }
    }

    @PostMapping("/faculty")
    @Operation(summary = "Register a new faculty member", description = "Admin creates a faculty account. Credentials are sent to personal email.")
    public ResponseEntity<AdminUserRegistrationResponse> registerFaculty(
            @Valid @RequestBody AdminUserRegistrationRequest request) {
        try {
            log.info("Admin registering new faculty: {} {}", request.getFirstName(), request.getLastName());
            AdminUserRegistrationResponse response = registrationService.registerFaculty(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Faculty registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    AdminUserRegistrationResponse.builder()
                            .message(e.getMessage())
                            .emailSent(false)
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error during faculty registration: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    AdminUserRegistrationResponse.builder()
                            .message("An unexpected error occurred: " + e.getMessage())
                            .emailSent(false)
                            .build());
        }
    }

    @PostMapping("/librarian")
    @Operation(summary = "Register a new librarian", description = "Admin creates a librarian account. Credentials are sent to personal email.")
    public ResponseEntity<AdminUserRegistrationResponse> registerLibrarian(
            @Valid @RequestBody AdminUserRegistrationRequest request) {
        try {
            log.info("Admin registering new librarian: {} {}", request.getFirstName(), request.getLastName());
            AdminUserRegistrationResponse response = registrationService.registerLibrarian(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Librarian registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    AdminUserRegistrationResponse.builder()
                            .message(e.getMessage())
                            .emailSent(false)
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error during librarian registration: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    AdminUserRegistrationResponse.builder()
                            .message("An unexpected error occurred: " + e.getMessage())
                            .emailSent(false)
                            .build());
        }
    }

    @PostMapping("/admin")
    @Operation(summary = "Register a new admin", description = "Admin creates another admin account. Credentials are sent to personal email.")
    public ResponseEntity<AdminUserRegistrationResponse> registerAdmin(
            @Valid @RequestBody AdminUserRegistrationRequest request) {
        try {
            log.info("Admin registering new admin: {} {}", request.getFirstName(), request.getLastName());
            AdminUserRegistrationResponse response = registrationService.registerAdmin(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Admin registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    AdminUserRegistrationResponse.builder()
                            .message(e.getMessage())
                            .emailSent(false)
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error during admin registration: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    AdminUserRegistrationResponse.builder()
                            .message("An unexpected error occurred: " + e.getMessage())
                            .emailSent(false)
                            .build());
        }
    }
}
