package com.education.sms.controller;

import com.education.sms.dto.*;
import com.education.sms.service.UserManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - User Management", description = "Admin endpoints for managing all users")
public class UserManagementController {

    private final UserManagementService userManagementService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard stats", description = "Admin dashboard with key statistics")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(userManagementService.getDashboardStats());
    }

    @GetMapping("/students")
    @Operation(summary = "Get all students", description = "Paginated list of all students")
    public ResponseEntity<PagedResponse<StudentSummaryResponse>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(userManagementService.getAllStudents(pageable));
    }

    @GetMapping("/students/search")
    @Operation(summary = "Search students", description = "Search students by name")
    public ResponseEntity<PagedResponse<StudentSummaryResponse>> searchStudents(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userManagementService.searchStudents(name, pageable));
    }

    @GetMapping("/faculty")
    @Operation(summary = "Get all faculty", description = "Paginated list of all faculty members")
    public ResponseEntity<PagedResponse<FacultySummaryResponse>> getAllFaculty(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(userManagementService.getAllFaculty(pageable));
    }

    @GetMapping("/faculty/search")
    @Operation(summary = "Search faculty", description = "Search faculty by name")
    public ResponseEntity<PagedResponse<FacultySummaryResponse>> searchFaculty(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userManagementService.searchFaculty(name, pageable));
    }

    @GetMapping("/librarians")
    @Operation(summary = "Get all librarians", description = "Paginated list of all librarians")
    public ResponseEntity<PagedResponse<LibrarianSummaryResponse>> getAllLibrarians(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userManagementService.getAllLibrarians(pageable));
    }
}
