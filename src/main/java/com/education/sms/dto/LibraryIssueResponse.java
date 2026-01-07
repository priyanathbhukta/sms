package com.education.sms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record LibraryIssueResponse(
        Long issueId,
        Long bookId,
        String bookTitle,
        Long userId,
        String userEmail,
        LocalDate issueDate,
        LocalDate returnDate,
        BigDecimal fineAmount,
        String status) {
}
