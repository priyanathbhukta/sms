package com.education.sms.service;

import com.education.sms.dto.AnnouncementRequest;
import com.education.sms.dto.AnnouncementResponse;

import java.util.List;

public interface AnnouncementService {

    AnnouncementResponse createAnnouncement(AnnouncementRequest request);

    List<AnnouncementResponse> getAllAnnouncements();

    List<AnnouncementResponse> getAnnouncementsByClass(Long classId);

    List<AnnouncementResponse> getGeneralAnnouncements();

    List<AnnouncementResponse> getAnnouncementsForFeed(com.education.sms.entity.UserRole role);

    AnnouncementResponse getAnnouncementById(Long announcementId);

    void deleteAnnouncement(Long announcementId);
}
