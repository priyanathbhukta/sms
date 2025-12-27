package com.education.sms.service.impl;

import com.education.sms.dto.AnnouncementRequest;
import com.education.sms.entity.Announcement;
import com.education.sms.entity.ClassEntity;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.AnnouncementRepository;
import com.education.sms.repository.ClassEntityRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final ClassEntityRepository classEntityRepository;

    @Override
    @Transactional
    public Announcement createAnnouncement(AnnouncementRequest request) {
        User postBy = userRepository.findById(request.postByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.postByUserId()));

        Announcement.AnnouncementBuilder announcementBuilder = Announcement.builder()
                .title(request.title())
                .content(request.content())
                .postByUser(postBy);

        // Optionally target specific class
        if (request.targetClassId() != null) {
            ClassEntity targetClass = classEntityRepository.findById(request.targetClassId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Class not found with id: " + request.targetClassId()));
            announcementBuilder.targetClass(targetClass);
        }

        return announcementRepository.save(announcementBuilder.build());
    }

    @Override
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<Announcement> getAnnouncementsByClass(Long classId) {
        return announcementRepository.findByTargetClassIdOrderByCreatedAtDesc(classId);
    }

    @Override
    public List<Announcement> getGeneralAnnouncements() {
        return announcementRepository.findByTargetClassIsNullOrderByCreatedAtDesc();
    }

    @Override
    public Announcement getAnnouncementById(Long announcementId) {
        return announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + announcementId));
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long announcementId) {
        if (!announcementRepository.existsById(announcementId)) {
            throw new ResourceNotFoundException("Announcement not found with id: " + announcementId);
        }
        announcementRepository.deleteById(announcementId);
    }
}
