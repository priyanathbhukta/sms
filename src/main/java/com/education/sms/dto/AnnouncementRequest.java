package com.education.sms.dto;

public record AnnouncementRequest(
        String title,
        String content,
        Long postByUserId,
        Long targetClassId // null for general announcements
) {
}
