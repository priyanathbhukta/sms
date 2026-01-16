package com.education.sms.controller;

import com.education.sms.dto.AuthRequest;
import com.education.sms.dto.AuthResponse;
import com.education.sms.entity.User;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for authentication operations.
 * Note: Registration is now admin-only via AdminRegistrationController.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login and logout endpoints")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    /**
     * @deprecated Self-registration is disabled. Use admin registration endpoints.
     */
    @PostMapping("/register")
    @Operation(summary = "Register (DISABLED)", description = "Self-registration is disabled. Contact admin for account creation.")
    @Deprecated
    public ResponseEntity<AuthResponse> register(@RequestBody Object request) {
        log.warn("Attempted access to disabled registration endpoint");
        return ResponseEntity.status(403).body(
                new AuthResponse(null,
                        "Self-registration is disabled. Please contact your administrator to create an account."));
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return JWT token")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Input Validation
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Email cannot be empty"));
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Password cannot be empty"));
        }

        try {
            String token = authService.login(request.getEmail(), request.getPassword());

            // Check if user must change password
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);
            boolean mustChangePassword = user != null && Boolean.TRUE.equals(user.getMustChangePassword());
            String role = user != null ? user.getRole().name() : null;

            // Enhanced response with mustChangePassword flag
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login Successful");
            response.put("mustChangePassword", mustChangePassword);
            response.put("role", role);
            response.put("email", request.getEmail());

            log.info("User logged in: {} (mustChangePassword: {})", request.getEmail(), mustChangePassword);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Login failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(401).body(new AuthResponse(null, e.getMessage()));
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Logout user and record logout time")
    public ResponseEntity<String> logout(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.badRequest().body("Not logged in");
        }
        authService.logout(principal.getName());
        log.info("User logged out: {}", principal.getName());
        return ResponseEntity.ok("Successfully logged out");
    }
}
