package com.education.sms.service.impl;

import com.education.sms.dto.PasswordChangeRequest;
import com.education.sms.dto.PasswordResetConfirm;
import com.education.sms.dto.PasswordResetRequest;
import com.education.sms.entity.PasswordResetToken;
import com.education.sms.entity.User;
import com.education.sms.repository.PasswordResetTokenRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.EmailService;
import com.education.sms.service.PasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordServiceImpl implements PasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${password.reset.token.expiry-minutes:30}")
    private int tokenExpiryMinutes;

    @Override
    @Transactional
    public void changePassword(String email, PasswordChangeRequest request) {
        log.info("Processing password change for user: {}", email);

        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Validate new password is different
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        // Send notification email if personal email exists
        if (user.getPersonalEmail() != null && !user.getPersonalEmail().isBlank()) {
            try {
                // Get first name from profile (fallback to email)
                String firstName = getFirstNameFromUser(user);
                emailService.sendPasswordChangedNotification(user.getPersonalEmail(), firstName);
            } catch (Exception e) {
                log.warn("Failed to send password changed notification: {}", e.getMessage());
            }
        }

        log.info("Password changed successfully for user: {}", email);
    }

    @Override
    @Transactional
    public void requestPasswordReset(PasswordResetRequest request) {
        log.info("Processing password reset request for email: {}", request.getEmail());

        // Find user by email (can be system email or personal email)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> userRepository.findByPersonalEmail(request.getEmail())
                        .orElse(null));

        if (user == null) {
            // Don't reveal if user exists - always show success message
            log.warn("Password reset requested for non-existent email: {}", request.getEmail());
            return; // Silently return - don't reveal user existence
        }

        // Check if user has personal email for reset
        String resetEmail = user.getPersonalEmail();
        if (resetEmail == null || resetEmail.isBlank()) {
            log.warn("User {} has no personal email for password reset", user.getEmail());
            // Still don't reveal this - contact admin message should be shown
            return;
        }

        // Invalidate any existing tokens for this user
        tokenRepository.invalidateAllUserTokens(user);

        // Generate new reset token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(tokenExpiryMinutes);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(expiresAt)
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        // Send reset email
        try {
            String firstName = getFirstNameFromUser(user);
            emailService.sendPasswordResetEmail(resetEmail, token, firstName);
            log.info("Password reset email sent to: {}", resetEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
            throw new RuntimeException("Failed to send password reset email. Please try again later.");
        }
    }

    @Override
    @Transactional
    public void confirmPasswordReset(PasswordResetConfirm request) {
        log.info("Processing password reset confirmation");

        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        // Find and validate token
        PasswordResetToken resetToken = tokenRepository.findValidToken(request.getToken(), LocalDateTime.now())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (!resetToken.isValid()) {
            throw new IllegalArgumentException("Reset token has expired or already been used");
        }

        // Get user
        User user = resetToken.getUser();

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Send notification
        if (user.getPersonalEmail() != null && !user.getPersonalEmail().isBlank()) {
            try {
                String firstName = getFirstNameFromUser(user);
                emailService.sendPasswordChangedNotification(user.getPersonalEmail(), firstName);
            } catch (Exception e) {
                log.warn("Failed to send password changed notification: {}", e.getMessage());
            }
        }

        log.info("Password reset completed for user: {}", user.getEmail());
    }

    @Override
    public boolean mustChangePassword(String email) {
        return userRepository.findByEmail(email)
                .map(User::getMustChangePassword)
                .orElse(false);
    }

    private String getFirstNameFromUser(User user) {
        // Extract first name from email (before the first dot)
        String email = user.getEmail();
        if (email != null && email.contains(".")) {
            String firstName = email.substring(0, email.indexOf('.'));
            return firstName.substring(0, 1).toUpperCase() + firstName.substring(1).toLowerCase();
        }
        return "User";
    }
}
