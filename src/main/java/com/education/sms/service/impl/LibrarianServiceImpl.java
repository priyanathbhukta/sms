package com.education.sms.service.impl;

import com.education.sms.dto.RegisterRequest;
import com.education.sms.entity.Librarian;
import com.education.sms.entity.User;
import com.education.sms.entity.UserRole;
import com.education.sms.repository.LibrarianRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.LibrarianService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class LibrarianServiceImpl implements LibrarianService {

    private final UserRepository userRepository;
    private final LibrarianRepository librarianRepository;
    private final PasswordEncoder passwordEncoder;

    // Email format: firstName.lastName.employeeId@sms.edu.in
    private static final String LIBRARIAN_EMAIL_REGEX = "^[a-zA-Z]+\\.[a-zA-Z]+\\.\\d+@sms\\.edu\\.in$";

    @Override
    @Transactional
    public void createLibrarian(RegisterRequest request) {
        String email = request.getEmail();

        // 1. Validate Email Format
        if (!Pattern.matches(LIBRARIAN_EMAIL_REGEX, email)) {
            throw new IllegalArgumentException(
                    "Invalid email format. Expected: firstName.lastName.employeeId@sms.edu.in");
        }

        // 2. Check Exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        // 3. Create User
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.LIBRARIAN)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // 4. Create Librarian Profile
        Librarian librarian = Librarian.builder()
                .user(savedUser)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .employeeId(request.getAdditionalId()) // Assuming employeeId comes here
                .phone(null) // Optional
                .build();

        librarianRepository.save(librarian);
    }
}
