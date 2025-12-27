package com.education.sms.dto;

public record BookRequest(
        String title,
        String author,
        String isbn,
        Integer totalCopies) {
}
