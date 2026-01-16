package com.education.sms.controller;

import com.education.sms.dto.FacultySummaryResponse;
import com.education.sms.dto.FacultyUpdateRequest;
import com.education.sms.entity.Faculty;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.FacultyRepository;
import com.education.sms.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
@Tag(name = "Faculty", description = "Faculty management endpoints")
public class FacultyController {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get faculty by ID", description = "Get detailed faculty information by faculty ID")
    public ResponseEntity<FacultySummaryResponse> getFacultyById(@PathVariable Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        return ResponseEntity.ok(mapToSummaryResponse(faculty));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update faculty", description = "Update faculty information (admin only)")
    public ResponseEntity<?> updateFaculty(@PathVariable Long id, @RequestBody FacultyUpdateRequest request) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        // Update first/last name if provided
        if (request.getFirstName() != null) {
            faculty.setFirstName(request.getFirstName().trim());
        }
        if (request.getLastName() != null) {
            faculty.setLastName(request.getLastName().trim());
        }

        // Update department if provided
        if (request.getDepartment() != null) {
            faculty.setDepartment(request.getDepartment().trim());
        }

        // Update phone if provided
        if (request.getPhone() != null) {
            String phone = request.getPhone().trim();
            faculty.setPhone(phone.isEmpty() ? null : phone);
        }

        Faculty savedFaculty = facultyRepository.save(faculty);

        return ResponseEntity.ok(Map.of(
                "message", "Faculty updated successfully",
                "faculty", mapToSummaryResponse(savedFaculty)));
    }

    private final com.education.sms.repository.SubjectRepository subjectRepository;

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete faculty", description = "Delete a faculty member and their user account (admin only)")
    public ResponseEntity<?> deleteFaculty(@PathVariable Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        // 1. Unassign faculty from subjects
        java.util.List<com.education.sms.entity.Subject> subjects = subjectRepository.findByFacultyId(id);
        for (com.education.sms.entity.Subject subject : subjects) {
            subject.setFaculty(null);
            subjectRepository.save(subject);
        }

        User user = faculty.getUser();

        // 2. Delete faculty (referential integrity check passed)
        facultyRepository.delete(faculty);

        // 3. Delete associated user account
        if (user != null) {
            userRepository.delete(user);
        }

        return ResponseEntity.ok(Map.of("message", "Faculty deleted successfully"));
    }

    private FacultySummaryResponse mapToSummaryResponse(Faculty faculty) {
        return new FacultySummaryResponse(
                faculty.getId(),
                faculty.getFirstName(),
                faculty.getLastName(),
                faculty.getFirstName() + " " + faculty.getLastName(),
                faculty.getUser() != null ? faculty.getUser().getEmail() : null,
                faculty.getDepartment(),
                faculty.getEmployeeId(),
                faculty.getPhone(),
                faculty.getUser() != null ? faculty.getUser().getProfileImageUrl() : null);
    }
}
