package com.education.sms.dto;

import com.education.sms.entity.UserRole;

public record AnnouncementRequest(
                String title,
                String content,
                Long postByUserId,
                Long targetClassId, // null for general announcements
                UserRole targetRole // null for all roles
) {
}
