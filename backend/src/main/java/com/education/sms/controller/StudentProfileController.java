package com.education.sms.controller;

import com.education.sms.dto.AnnouncementResponse;
import com.education.sms.dto.StudentProfileDTO;
import com.education.sms.dto.StudentProfileUpdateRequest;
import com.education.sms.entity.ClassEntity;
import com.education.sms.entity.Student;
import com.education.sms.entity.User;
import com.education.sms.entity.UserRole;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.StudentRepository;
import com.education.sms.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Profile", description = "Student profile management endpoints")
public class StudentProfileController {

    private final StudentRepository studentRepository;
    private final AnnouncementService announcementService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/profile")
    @Operation(summary = "Get my profile", description = "Get current student's profile details")
    public ResponseEntity<StudentProfileDTO> getMyProfile(@AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return ResponseEntity.ok(mapToProfileDTO(student));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update my profile", description = "Update current student's profile details")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal User user,
            @RequestBody StudentProfileUpdateRequest request) {

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        // Update phone if provided
        if (request.getPhone() != null) {
            student.setPhone(request.getPhone().trim().isEmpty() ? null : request.getPhone().trim());
        }

        // Update address if provided
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress().trim().isEmpty() ? null : request.getAddress().trim());
        }

        Student savedStudent = studentRepository.save(student);

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "profile", mapToProfileDTO(savedStudent)));
    }

    @PostMapping("/profile/image")
    @Operation(summary = "Upload profile image", description = "Upload a passport-size profile image")
    public ResponseEntity<?> uploadProfileImage(
            @AuthenticationPrincipal User user,
            @RequestParam("image") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please select an image file"));
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only image files are allowed"));
        }

        // Validate file size (max 2MB)
        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("message", "Image size must be less than 2MB"));
        }

        try {
            Student student = studentRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, "profiles");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = "student_" + student.getStudentId() + "_" + UUID.randomUUID().toString().substring(0, 8)
                    + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update student profile with image URL
            String imageUrl = "/uploads/profiles/" + filename;
            student.setProfileImageUrl(imageUrl);
            studentRepository.save(student);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile image uploaded successfully",
                    "imageUrl", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to upload image: " + e.getMessage()));
        }
    }

    @GetMapping("/{studentId}/announcements")
    @Operation(summary = "Get my announcements", description = "Get announcements for student (general + class-specific)")
    public ResponseEntity<List<AnnouncementResponse>> getMyAnnouncements(
            @AuthenticationPrincipal User user,
            @PathVariable Long studentId) {

        // Verify the student is requesting their own announcements
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (!student.getStudentId().equals(studentId)) {
            return ResponseEntity.status(403).body(List.of());
        }

        // Get general announcements for STUDENT role
        List<AnnouncementResponse> allAnnouncements = new ArrayList<>(
                announcementService.getAnnouncementsForFeed(UserRole.STUDENT));

        // Get class-specific announcements if student is in a class
        if (student.getClassEntity() != null) {
            List<AnnouncementResponse> classAnnouncements = announcementService
                    .getAnnouncementsByClass(student.getClassEntity().getId());
            allAnnouncements.addAll(classAnnouncements);
        }

        // Sort by createdAt descending and remove duplicates
        allAnnouncements = allAnnouncements.stream()
                .distinct()
                .sorted(Comparator.comparing(AnnouncementResponse::createdAt).reversed())
                .toList();

        return ResponseEntity.ok(allAnnouncements);
    }

    private StudentProfileDTO mapToProfileDTO(Student student) {
        ClassEntity classEntity = student.getClassEntity();
        User user = student.getUser();

        return StudentProfileDTO.builder()
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(user != null ? user.getEmail() : null)
                .registrationNumber(student.getRegistrationNumber())
                .phone(student.getPhone())
                .parentPhone(student.getParentPhone())
                .address(student.getAddress())
                .profileImageUrl(student.getProfileImageUrl())
                .className(classEntity != null ? classEntity.getGradeLevel() + " - " + classEntity.getSection() : null)
                .classId(classEntity != null ? classEntity.getId() : null)
                .gradeLevel(classEntity != null ? classEntity.getGradeLevel() : null)
                .section(classEntity != null ? classEntity.getSection() : null)
                .gamificationPoints(student.getGamificationPoints())
                .build();
    }
}
