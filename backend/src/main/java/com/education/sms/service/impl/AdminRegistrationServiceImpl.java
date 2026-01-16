package com.education.sms.service.impl;

import com.education.sms.dto.AdminUserRegistrationRequest;
import com.education.sms.dto.AdminUserRegistrationResponse;
import com.education.sms.entity.*;
import com.education.sms.repository.ClassEntityRepository;
import com.education.sms.repository.FacultyRepository;
import com.education.sms.repository.LibrarianRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.AdminRegistrationService;
import com.education.sms.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminRegistrationServiceImpl implements AdminRegistrationService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final LibrarianRepository librarianRepository;
    private final ClassEntityRepository classEntityRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Fixed default password for all new users
    private static final String DEFAULT_PASSWORD = "password123";

    private static final String STUDENT_EMAIL_SUFFIX = "@sms.edu.in";
    private static final String FACULTY_EMAIL_SUFFIX = "@sms.edu.in";
    private static final String LIBRARIAN_EMAIL_SUFFIX = "@sms.edu.in";

    @Override
    @Transactional
    public AdminUserRegistrationResponse registerStudent(AdminUserRegistrationRequest request) {
        log.info("Admin registering new student: {} {}", request.getFirstName(), request.getLastName());

        // Validate input
        validateRequest(request, "STUDENT");

        // Generate system email: firstName.lastName.year@sms.edu.in
        String year = request.getAdditionalId() != null ? request.getAdditionalId()
                : String.valueOf(LocalDateTime.now().getYear());
        String systemEmail = generateSystemEmail(request.getFirstName(), request.getLastName(), year,
                STUDENT_EMAIL_SUFFIX);

        // Check if email exists
        if (userRepository.existsByEmail(systemEmail)) {
            throw new IllegalArgumentException("A user with this email already exists: " + systemEmail);
        }

        // Use fixed password
        String password = DEFAULT_PASSWORD;

        // Create user
        User user = User.builder()
                .email(systemEmail)
                .password(passwordEncoder.encode(password))
                .role(UserRole.STUDENT)
                .isActive(true)
                .mustChangePassword(true)
                .personalEmail(request.getPersonalEmail())
                .build();

        User savedUser = userRepository.save(user);

        // Create student profile
        Student student = new Student();
        student.setUser(savedUser);
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());

        // Assign to class if classId is provided
        if (request.getClassId() != null) {
            ClassEntity classEntity = classEntityRepository.findById(request.getClassId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Class not found with ID: " + request.getClassId()));
            student.setClassEntity(classEntity);
            log.info("Student assigned to class: {} {}", classEntity.getGradeLevel(), classEntity.getSection());
        }

        studentRepository.save(student);

        // Send credentials email
        boolean emailSent = sendCredentialsEmail(request.getPersonalEmail(), systemEmail, password, "STUDENT",
                request.getFirstName());

        log.info("Student registered successfully: {}", systemEmail);

        String message = "Student registered successfully";
        if (request.getClassId() != null) {
            message += " and assigned to class";
        }
        message += emailSent ? ". Credentials sent to personal email."
                : ". Email sending failed - please share credentials manually.";

        return AdminUserRegistrationResponse.builder()
                .userId(savedUser.getId())
                .generatedEmail(systemEmail)
                .personalEmail(request.getPersonalEmail())
                .role("STUDENT")
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .message(message)
                .emailSent(emailSent)
                .build();
    }

    @Override
    @Transactional
    public AdminUserRegistrationResponse registerFaculty(AdminUserRegistrationRequest request) {
        log.info("Admin registering new faculty: {} {}", request.getFirstName(), request.getLastName());

        // Validate input
        validateRequest(request, "FACULTY");

        if (request.getDepartment() == null || request.getDepartment().isBlank()) {
            throw new IllegalArgumentException("Department is required for faculty registration");
        }

        // Generate system email: firstName.lastName.employeeId@sms.edu.in
        String employeeId = request.getAdditionalId() != null ? request.getAdditionalId() : generateEmployeeId();
        String systemEmail = generateSystemEmail(request.getFirstName(), request.getLastName(), employeeId,
                FACULTY_EMAIL_SUFFIX);

        // Check if email exists
        if (userRepository.existsByEmail(systemEmail)) {
            throw new IllegalArgumentException("A user with this email already exists: " + systemEmail);
        }

        // Use fixed password
        String password = DEFAULT_PASSWORD;

        // Create user
        User user = User.builder()
                .email(systemEmail)
                .password(passwordEncoder.encode(password))
                .role(UserRole.FACULTY)
                .isActive(true)
                .mustChangePassword(true)
                .personalEmail(request.getPersonalEmail())
                .build();

        User savedUser = userRepository.save(user);

        // Create faculty profile
        Faculty faculty = new Faculty();
        faculty.setUser(savedUser);
        faculty.setFirstName(request.getFirstName());
        faculty.setLastName(request.getLastName());
        faculty.setDepartment(request.getDepartment());
        faculty.setEmployeeId(employeeId);
        facultyRepository.save(faculty);

        // Send credentials email
        boolean emailSent = sendCredentialsEmail(request.getPersonalEmail(), systemEmail, password, "FACULTY",
                request.getFirstName());

        log.info("Faculty registered successfully: {}", systemEmail);

        return AdminUserRegistrationResponse.builder()
                .userId(savedUser.getId())
                .generatedEmail(systemEmail)
                .personalEmail(request.getPersonalEmail())
                .role("FACULTY")
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .message("Faculty registered successfully" + (emailSent ? ". Credentials sent to personal email."
                        : ". Email sending failed - please share credentials manually."))
                .emailSent(emailSent)
                .build();
    }

    @Override
    @Transactional
    public AdminUserRegistrationResponse registerLibrarian(AdminUserRegistrationRequest request) {
        log.info("Admin registering new librarian: {} {}", request.getFirstName(), request.getLastName());

        // Validate input
        validateRequest(request, "LIBRARIAN");

        // Generate system email: firstName.lastName.employeeId@sms.edu.in
        String employeeId = request.getAdditionalId() != null ? request.getAdditionalId() : generateEmployeeId();
        String systemEmail = generateSystemEmail(request.getFirstName(), request.getLastName(), employeeId,
                LIBRARIAN_EMAIL_SUFFIX);

        // Check if email exists
        if (userRepository.existsByEmail(systemEmail)) {
            throw new IllegalArgumentException("A user with this email already exists: " + systemEmail);
        }

        // Use fixed password
        String password = DEFAULT_PASSWORD;

        // Create user
        User user = User.builder()
                .email(systemEmail)
                .password(passwordEncoder.encode(password))
                .role(UserRole.LIBRARIAN)
                .isActive(true)
                .mustChangePassword(true)
                .personalEmail(request.getPersonalEmail())
                .build();

        User savedUser = userRepository.save(user);

        // Create librarian profile
        Librarian librarian = Librarian.builder()
                .user(savedUser)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .employeeId(employeeId)
                .phone(request.getPhone())
                .build();

        librarianRepository.save(librarian);

        // Send credentials email
        boolean emailSent = sendCredentialsEmail(request.getPersonalEmail(), systemEmail, password, "LIBRARIAN",
                request.getFirstName());

        log.info("Librarian registered successfully: {}", systemEmail);

        return AdminUserRegistrationResponse.builder()
                .userId(savedUser.getId())
                .generatedEmail(systemEmail)
                .personalEmail(request.getPersonalEmail())
                .role("LIBRARIAN")
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .message("Librarian registered successfully" + (emailSent ? ". Credentials sent to personal email."
                        : ". Email sending failed - please share credentials manually."))
                .emailSent(emailSent)
                .build();
    }

    @Override
    @Transactional
    public AdminUserRegistrationResponse registerAdmin(AdminUserRegistrationRequest request) {
        log.info("Admin registering new admin: {} {}", request.getFirstName(), request.getLastName());

        // Validate input
        validateRequest(request, "ADMIN");

        // Generate system email: admin.firstName.lastName@sms.edu.in
        String systemEmail = String.format("admin.%s.%s@sms.edu.in",
                request.getFirstName().toLowerCase().trim().replaceAll("\\s+", ""),
                request.getLastName().toLowerCase().trim().replaceAll("\\s+", ""));

        // Check if email exists
        if (userRepository.existsByEmail(systemEmail)) {
            throw new IllegalArgumentException("An admin with this email already exists: " + systemEmail);
        }

        // Use fixed password
        String password = DEFAULT_PASSWORD;

        // Create admin user
        User user = User.builder()
                .email(systemEmail)
                .password(passwordEncoder.encode(password))
                .role(UserRole.ADMIN)
                .isActive(true)
                .mustChangePassword(true)
                .personalEmail(request.getPersonalEmail())
                .build();

        User savedUser = userRepository.save(user);

        // Send credentials email
        boolean emailSent = sendCredentialsEmail(request.getPersonalEmail(), systemEmail, password, "ADMIN",
                request.getFirstName());

        log.info("Admin registered successfully: {}", systemEmail);

        return AdminUserRegistrationResponse.builder()
                .userId(savedUser.getId())
                .generatedEmail(systemEmail)
                .personalEmail(request.getPersonalEmail())
                .role("ADMIN")
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .message("Admin registered successfully" + (emailSent ? ". Credentials sent to personal email."
                        : ". Email sending failed - please share credentials manually."))
                .emailSent(emailSent)
                .build();
    }

    @Override
    public String generateTemporaryPassword() {
        // Now returns the fixed default password
        return DEFAULT_PASSWORD;
    }

    private void validateRequest(AdminUserRegistrationRequest request, String expectedRole) {
        if (request.getFirstName() == null || request.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (request.getPersonalEmail() == null || request.getPersonalEmail().isBlank()) {
            throw new IllegalArgumentException("Personal email is required");
        }
        if (!request.getPersonalEmail().matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            throw new IllegalArgumentException("Invalid personal email format");
        }
    }

    private String generateSystemEmail(String firstName, String lastName, String identifier, String suffix) {
        return String.format("%s.%s.%s%s",
                firstName.toLowerCase().trim().replaceAll("\\s+", ""),
                lastName.toLowerCase().trim().replaceAll("\\s+", ""),
                identifier,
                suffix);
    }

    private String generateEmployeeId() {
        // Generate a 3-digit employee ID based on count
        long count = userRepository.count();
        return String.format("%03d", (count % 1000) + 100);
    }

    private boolean sendCredentialsEmail(String personalEmail, String systemEmail, String password, String role,
            String firstName) {
        try {
            emailService.sendCredentialsEmail(personalEmail, systemEmail, password, role, firstName);
            return true;
        } catch (Exception e) {
            log.error("Failed to send credentials email to {}: {}", personalEmail, e.getMessage());
            return false;
        }
    }
}
