package com.education.sms.service;

import com.education.sms.dto.AnnouncementRequest;
import com.education.sms.entity.Announcement;

import java.util.List;

public interface AnnouncementService {

    Announcement createAnnouncement(AnnouncementRequest request);

    List<Announcement> getAllAnnouncements();

    List<Announcement> getAnnouncementsByClass(Long classId);

    List<Announcement> getGeneralAnnouncements(); // For all students/faculty

    Announcement getAnnouncementById(Long announcementId);

    void deleteAnnouncement(Long announcementId);
}
