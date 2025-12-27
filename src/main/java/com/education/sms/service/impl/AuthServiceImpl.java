package com.education.sms.service.impl;

import com.education.sms.dto.RegisterRequest;
import com.education.sms.entity.*;
import com.education.sms.repository.FacultyRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.AuthService;
import com.education.sms.utils.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           StudentRepository studentRepository,
                           FacultyRepository facultyRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Regex Constants
    private static final String STUDENT_EMAIL_REGEX = "^[a-zA-Z]+\\.[a-zA-Z]+\\.\\d{4}@sms\\.edu\\.in$";
    private static final String FACULTY_EMAIL_REGEX = "^[a-zA-Z]+\\.[a-zA-Z]+\\.\\d{3}@sms\\.edu\\.in$";
    private static final String ADMIN_EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@sms\\.admin\\.in$";

    @Override
    @Transactional
    public String register(RegisterRequest request) {

        String email = request.getEmail();
        UserRole role;

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        try {
            role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        validateEmailFormat(email, role);

        // 1️⃣ Save USER first
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.saveAndFlush(user);

        // 2️⃣ Save PROFILE based on role
        switch (role) {

            case STUDENT -> {
                Student student = new Student();
                student.setUser(savedUser);
                student.setFirstName(request.getFirstName());
                student.setLastName(request.getLastName());
                studentRepository.save(student);
            }

            case FACULTY -> {
                Faculty faculty = new Faculty();
                faculty.setUser(savedUser);
                faculty.setFirstName(request.getFirstName());
                faculty.setLastName(request.getLastName());
                faculty.setDepartment(request.getDepartment());
                faculty.setEmployeeId(request.getAdditionalId()); // ✅ FIXED
                facultyRepository.save(faculty);
            }

            case ADMIN -> {
                // Admin profile optional
            }

            default -> throw new RuntimeException("Unsupported role");
        }

        // 3️⃣ Generate JWT only after successful DB save
        return jwtUtil.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Override
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    private void validateEmailFormat(String email, UserRole role) {

        boolean isValid = switch (role) {
            case ADMIN -> Pattern.matches(ADMIN_EMAIL_REGEX, email);
            case STUDENT -> Pattern.matches(STUDENT_EMAIL_REGEX, email);
            case FACULTY -> Pattern.matches(FACULTY_EMAIL_REGEX, email);
        };

        if (!isValid) {
            throw new RuntimeException("Invalid email format for role: " + role);
        }
    }
}
