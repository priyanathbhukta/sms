package com.education.sms.service.impl;

import com.education.sms.dto.AnnouncementRequest;
import com.education.sms.dto.AnnouncementResponse;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;
    private final ClassEntityRepository classEntityRepository;

    @Override
    @Transactional
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
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
        } else if (request.targetRole() != null) {
            announcementBuilder.targetRole(request.targetRole());
        }

        return toResponse(announcementRepository.save(announcementBuilder.build()));
    }

    @Override
    public List<AnnouncementResponse> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementResponse> getAnnouncementsByClass(Long classId) {
        return announcementRepository.findByTargetClassIdOrderByCreatedAtDesc(classId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementResponse> getGeneralAnnouncements() {
        return announcementRepository.findByTargetClassIsNullOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementResponse> getAnnouncementsForFeed(com.education.sms.entity.UserRole role) {
        // Get all non-class specific announcements (Global + Targeted Role)
        List<Announcement> allGeneral = announcementRepository.findByTargetClassIsNullOrderByCreatedAtDesc();

        // Filter: Keep if targetRole is NULL (Global) OR targetRole matches user's role
        return allGeneral.stream()
                .filter(a -> a.getTargetRole() == null || a.getTargetRole() == role)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementResponse getAnnouncementById(Long announcementId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + announcementId));
        return toResponse(announcement);
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long announcementId) {
        if (!announcementRepository.existsById(announcementId)) {
            throw new ResourceNotFoundException("Announcement not found with id: " + announcementId);
        }
        announcementRepository.deleteById(announcementId);
    }

    private AnnouncementResponse toResponse(Announcement entity) {
        ClassEntity targetClass = entity.getTargetClass();
        return new AnnouncementResponse(
                entity.getAnnouncementId(),
                entity.getTitle(),
                entity.getContent(),
                entity.getPostByUser().getId(),
                entity.getPostByUser().getEmail(),
                targetClass != null ? targetClass.getId() : null,
                targetClass != null ? targetClass.getGradeLevel() + "-" + targetClass.getSection() : null,
                entity.getTargetRole(),
                entity.getCreatedAt());
    }
}
