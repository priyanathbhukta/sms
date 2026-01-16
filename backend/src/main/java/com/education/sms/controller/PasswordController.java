package com.education.sms.controller;

import com.education.sms.dto.PasswordChangeRequest;
import com.education.sms.dto.PasswordResetConfirm;
import com.education.sms.dto.PasswordResetRequest;
import com.education.sms.service.PasswordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

/**
 * Controller for password management operations.
 * Includes password change (authenticated) and password reset (public).
 */
@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
@Tag(name = "Password Management", description = "Endpoints for password change and reset")
@Slf4j
public class PasswordController {

    private final PasswordService passwordService;

    @PostMapping("/change")
    @Operation(summary = "Change password", description = "Change password for authenticated user. Used for first-login password change.")
    public ResponseEntity<?> changePassword(
            Principal principal,
            @Valid @RequestBody PasswordChangeRequest request) {
        try {
            if (principal == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "You must be logged in to change your password"));
            }

            log.info("Password change requested by user: {}", principal.getName());
            passwordService.changePassword(principal.getName(), request);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            log.error("Password change failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during password change: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred"));
        }
    }

    @PostMapping("/reset/request")
    @Operation(summary = "Request password reset", description = "Send password reset link to user's personal email")
    public ResponseEntity<?> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequest request) {
        try {
            log.info("Password reset requested for email: {}", request.getEmail());
            passwordService.requestPasswordReset(request);

            // Always return success to prevent email enumeration
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "If your email is registered, you will receive a password reset link shortly"));
        } catch (Exception e) {
            log.error("Unexpected error during password reset request: {}", e.getMessage());
            // Still return success to prevent enumeration
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "If your email is registered, you will receive a password reset link shortly"));
        }
    }

    @PostMapping("/reset/confirm")
    @Operation(summary = "Confirm password reset", description = "Reset password using the token from email")
    public ResponseEntity<?> confirmPasswordReset(
            @Valid @RequestBody PasswordResetConfirm request) {
        try {
            log.info("Password reset confirmation processing");
            passwordService.confirmPasswordReset(request);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password reset successfully. You can now login with your new password."));
        } catch (IllegalArgumentException e) {
            log.error("Password reset confirmation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during password reset confirmation: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred"));
        }
    }

    @GetMapping("/must-change")
    @Operation(summary = "Check if password change required", description = "Check if the authenticated user must change their password")
    public ResponseEntity<?> mustChangePassword(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "mustChangePassword", false,
                    "message", "Not authenticated"));
        }

        boolean mustChange = passwordService.mustChangePassword(principal.getName());
        return ResponseEntity.ok(Map.of(
                "mustChangePassword", mustChange));
    }
}
