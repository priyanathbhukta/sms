package com.education.sms.dto;

import com.education.sms.entity.UserRole;
import java.time.LocalDateTime;

public record AnnouncementResponse(
                Long announcementId,
                String title,
                String content,
                Long postByUserId,
                String postByUserEmail,
                Long targetClassId,
                String targetClassName,
                UserRole targetRole,
                LocalDateTime createdAt) {
}
