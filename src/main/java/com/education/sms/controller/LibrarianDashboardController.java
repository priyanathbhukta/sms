package com.education.sms.controller;

import com.education.sms.dto.*;
import com.education.sms.entity.User;
import com.education.sms.repository.*;
import com.education.sms.service.BookRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/librarian/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LIBRARIAN')")
@Tag(name = "Librarian Dashboard", description = "Library management dashboard for librarians")
public class LibrarianDashboardController {

    private final BookRepository bookRepository;
    private final LibraryIssueRepository libraryIssueRepository;
    private final BookRequestRepository bookRequestRepository;
    private final BookRequestService bookRequestService;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard stats", description = "Librarian dashboard with library statistics")
    public ResponseEntity<LibrarianDashboardStats> getDashboardStats() {
        long totalBooks = bookRepository.count();
        long overdueBooks = libraryIssueRepository.countOverdueIssues();
        long pendingRequests = bookRequestRepository.countPendingRequests();

        // Calculate available and issued books
        var allBooks = bookRepository.findAll();
        long availableBooks = allBooks.stream()
                .filter(b -> b.getAvailableCopies() > 0)
                .count();
        long issuedBooks = allBooks.stream()
                .mapToInt(b -> b.getTotalCopies() - b.getAvailableCopies())
                .sum();

        // Today's activity - simplified
        long todayIssued = 0;
        long todayReturned = 0;

        var stats = new LibrarianDashboardStats(
                totalBooks,
                availableBooks,
                issuedBooks,
                overdueBooks,
                pendingRequests,
                todayIssued,
                todayReturned);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/pending-requests")
    @Operation(summary = "Get pending book requests", description = "All pending book requests awaiting approval")
    public ResponseEntity<PagedResponse<BookRequestResponse>> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestDate").ascending());
        return ResponseEntity.ok(bookRequestService.getPendingRequests(pageable));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue books", description = "List of all overdue library issues", hidden = true)
    public ResponseEntity<?> getOverdueIssues() {
        return ResponseEntity.ok(libraryIssueRepository.findOverdueIssues());
    }

    @GetMapping("/available-books")
    @Operation(summary = "Get available books", description = "Books with available copies", hidden = true)
    public ResponseEntity<?> getAvailableBooks() {
        var availableBooks = bookRepository.findAll().stream()
                .filter(b -> b.getAvailableCopies() > 0)
                .toList();
        return ResponseEntity.ok(availableBooks);
    }
}
