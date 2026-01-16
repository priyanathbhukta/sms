package com.education.sms.config;

import com.education.sms.entity.User;
import com.education.sms.entity.UserRole;
import com.education.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Bootstrap component that creates the initial admin user if none exists.
 * This solves the chicken-and-egg problem where admin is required to create
 * users,
 * but there's no admin in a fresh database.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrap {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_ADMIN_EMAIL = "admin@sms.edu.in";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void createDefaultAdminIfNotExists() {
        log.info("Checking for existing admin user...");

        if (userRepository.existsByRole(UserRole.ADMIN)) {
            log.info("Admin user already exists. Skipping bootstrap.");
            return;
        }

        log.info("No admin user found. Creating default admin...");

        User adminUser = User.builder()
                .email(DEFAULT_ADMIN_EMAIL)
                .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                .role(UserRole.ADMIN)
                .isActive(true)
                .mustChangePassword(true) // Force password change on first login
                .build();

        userRepository.save(adminUser);

        log.info("========================================");
        log.info("DEFAULT ADMIN USER CREATED");
        log.info("Email:    {}", DEFAULT_ADMIN_EMAIL);
        log.info("Password: {}", DEFAULT_ADMIN_PASSWORD);
        log.info("Please change this password after first login!");
        log.info("========================================");
    }
}
