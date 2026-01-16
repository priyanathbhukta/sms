package com.education.sms.controller;

import com.education.sms.dto.LibraryIssueRequest;
import com.education.sms.dto.LibraryIssueResponse;
import com.education.sms.service.LibraryIssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/library-issues")
@RequiredArgsConstructor
public class LibraryIssueController {

    private final LibraryIssueService libraryIssueService;

    @PostMapping("/issue")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> issueBook(@RequestBody LibraryIssueRequest request) {
        if (request.bookId() == null || request.userId() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            return ResponseEntity.ok(libraryIssueService.issueBook(request));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{issueId}/return")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> returnBook(
            @PathVariable Long issueId,
            @RequestParam(required = false, defaultValue = "0") BigDecimal fineAmount) {
        try {
            return ResponseEntity.ok(libraryIssueService.returnBook(issueId, fineAmount));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'STUDENT')")
    public ResponseEntity<List<LibraryIssueResponse>> getIssuesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(libraryIssueService.getIssuesByUser(userId));
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<LibraryIssueResponse>> getIssuesByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(libraryIssueService.getIssuesByBook(bookId));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<LibraryIssueResponse>> getActiveIssues() {
        return ResponseEntity.ok(libraryIssueService.getActiveIssues());
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<LibraryIssueResponse>> getOverdueIssues() {
        return ResponseEntity.ok(libraryIssueService.getOverdueIssues());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'STUDENT')")
    @io.swagger.v3.oas.annotations.Operation(hidden = true)
    public ResponseEntity<?> getIssueById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(libraryIssueService.getIssueById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
