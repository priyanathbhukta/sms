package com.education.sms.dto;

public record EventParticipantResponse(
        Long epId,
        Long eventId,
        String eventTitle,
        Long userId,
        String userEmail,
        String role) {
}
