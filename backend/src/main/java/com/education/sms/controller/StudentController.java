package com.education.sms.controller;

import com.education.sms.dto.StudentSummaryResponse;
import com.education.sms.dto.StudentUpdateRequest;
import com.education.sms.entity.ClassEntity;
import com.education.sms.entity.Student;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.ClassEntityRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student management endpoints")
public class StudentController {

    private final StudentRepository studentRepository;
    private final ClassEntityRepository classEntityRepository;
    private final UserRepository userRepository;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get student by ID", description = "Get detailed student information by student ID")
    public ResponseEntity<StudentSummaryResponse> getStudentById(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        return ResponseEntity.ok(mapToSummaryResponse(student));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update student", description = "Update student information (admin only)")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentUpdateRequest request) {
        try {
            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

            // Update first/last name if provided
            if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
                student.setFirstName(request.getFirstName().trim());
            }
            if (request.getLastName() != null && !request.getLastName().isBlank()) {
                student.setLastName(request.getLastName().trim());
            }

            // Update class assignment if provided
            if (request.getClassId() != null) {
                if (request.getClassId() == 0L) {
                    // Remove from class
                    student.setClassEntity(null);
                } else {
                    ClassEntity classEntity = classEntityRepository.findById(request.getClassId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Class not found with id: " + request.getClassId()));
                    student.setClassEntity(classEntity);
                }
            }

            // Update parent phone if provided
            if (request.getParentPhone() != null) {
                student.setParentPhone(
                        request.getParentPhone().trim().isEmpty() ? null : request.getParentPhone().trim());
            }

            // Update address if provided
            if (request.getAddress() != null) {
                student.setAddress(request.getAddress().trim().isEmpty() ? null : request.getAddress().trim());
            }

            Student savedStudent = studentRepository.save(student);

            return ResponseEntity.ok(Map.of(
                    "message", "Student updated successfully",
                    "student", mapToSummaryResponse(savedStudent)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to update student: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete student", description = "Delete a student and their user account (admin only)")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = student.getUser();

        // Delete student first (referential integrity)
        studentRepository.delete(student);

        // Delete associated user account
        if (user != null) {
            userRepository.delete(user);
        }

        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }

    private StudentSummaryResponse mapToSummaryResponse(Student student) {
        String className = student.getClassEntity() != null
                ? student.getClassEntity().getGradeLevel() + " - " + student.getClassEntity().getSection()
                : "Not Assigned";

        Long classId = student.getClassEntity() != null ? student.getClassEntity().getId() : null;

        // Extract enrollment year from email
        String enrollmentYear = null;
        String email = student.getUser() != null ? student.getUser().getEmail() : null;
        if (email != null && email.contains("@sms.edu.in")) {
            String[] parts = email.split("@")[0].split("\\.");
            if (parts.length >= 3) {
                enrollmentYear = parts[parts.length - 1];
            }
        }

        return new StudentSummaryResponse(
                student.getStudentId(),
                student.getStudentId(),
                student.getFirstName(),
                student.getLastName(),
                student.getFirstName() + " " + student.getLastName(),
                student.getRegistrationNumber(),
                email,
                enrollmentYear,
                className,
                classId,
                student.getParentPhone(),
                student.getAddress());
    }
}
