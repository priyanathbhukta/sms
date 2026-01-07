package com.education.sms.controller;

import com.education.sms.dto.BookRequestActionDTO;
import com.education.sms.dto.BookRequestCreateDTO;
import com.education.sms.dto.BookRequestResponse;
import com.education.sms.dto.PagedResponse;
import com.education.sms.entity.User;
import com.education.sms.service.BookRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/book-requests")
@RequiredArgsConstructor
@Tag(name = "Book Requests", description = "Book request workflow for students and librarians")
public class BookRequestController {

    private final BookRequestService bookRequestService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Create book request", description = "Student requests a book from the library")
    public ResponseEntity<?> createRequest(@Valid @RequestBody BookRequestCreateDTO request) {
        try {
            return ResponseEntity.ok(bookRequestService.createRequest(request));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/process")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @Operation(summary = "Process book request", description = "Librarian approves or rejects a book request")
    public ResponseEntity<?> processRequest(
            @Valid @RequestBody BookRequestActionDTO action,
            @Parameter(hidden = true) @AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(bookRequestService.processRequest(action, user.getId()));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get my requests", description = "Student views their own book requests")
    public ResponseEntity<PagedResponse<BookRequestResponse>> getMyRequests(
            @Parameter(hidden = true) @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Get student ID from user
        // For now, returning based on user ID - should be linked to Student entity
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestDate").descending());
        return ResponseEntity.ok(bookRequestService.getRequestsByStudent(user.getId(), pageable));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @Operation(summary = "Get student requests", description = "Librarian views requests by student")
    public ResponseEntity<PagedResponse<BookRequestResponse>> getRequestsByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestDate").descending());
        return ResponseEntity.ok(bookRequestService.getRequestsByStudent(studentId, pageable));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @Operation(summary = "Get pending requests", description = "Librarian views all pending book requests")
    public ResponseEntity<PagedResponse<BookRequestResponse>> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestDate").ascending());
        return ResponseEntity.ok(bookRequestService.getPendingRequests(pageable));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @Operation(summary = "Get requests by status", description = "Librarian views requests by status")
    public ResponseEntity<PagedResponse<BookRequestResponse>> getRequestsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestDate").descending());
        return ResponseEntity.ok(bookRequestService.getRequestsByStatus(status, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'STUDENT')")
    @Operation(summary = "Get request by ID", description = "View a specific book request")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookRequestService.getRequestById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Cancel request", description = "Student cancels their pending request")
    public ResponseEntity<?> cancelRequest(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal User user) {
        try {
            // Assuming user ID maps to student ID for simplicity
            return ResponseEntity.ok(bookRequestService.cancelRequest(id, user.getId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
