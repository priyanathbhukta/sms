package com.education.sms.controller;

import com.education.sms.dto.AuthRequest;
import com.education.sms.dto.AuthResponse;
import com.education.sms.dto.RegisterRequest;
import com.education.sms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Injecting the Interface (Abstraction)
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Input Validation
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Email cannot be empty"));
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Password cannot be empty"));
        }
        if (request.getFirstName() == null || request.getFirstName().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "First name cannot be empty"));
        }
        if (request.getLastName() == null || request.getLastName().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Last name cannot be empty"));
        }
        if (request.getRole() == null || request.getRole().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Role cannot be empty"));
        }

        try {
            // Polymorphism: This calls register() in AuthServiceImpl
            String token = authService.register(request);
            return ResponseEntity.ok(new AuthResponse(token, "User registered successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // Input Validation
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Email cannot be empty"));
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Password cannot be empty"));
        }

        try {
            String token = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new AuthResponse(token, "Login Successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, e.getMessage()));
        }
    }

}
