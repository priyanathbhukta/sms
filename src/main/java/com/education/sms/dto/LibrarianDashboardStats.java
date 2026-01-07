package com.education.sms.dto;

/**
 * Dashboard statistics for Librarian.
 */
public record LibrarianDashboardStats(
        long totalBooks,
        long availableBooks,
        long issuedBooks,
        long overdueBooks,
        long pendingRequests,
        long todayIssued,
        long todayReturned) {
}
