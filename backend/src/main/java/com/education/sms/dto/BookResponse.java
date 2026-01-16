package com.education.sms.dto;

public record BookResponse(
        Long bookId,
        String title,
        String author,
        String isbn,
        Integer totalCopies,
        Integer availableCopies) {
}
