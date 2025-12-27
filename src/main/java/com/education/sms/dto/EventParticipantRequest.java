package com.education.sms.dto;

public record EventParticipantRequest(
        Long eventId,
        Long userId,
        String role) {
}
