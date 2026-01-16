package com.education.sms.repository;

import com.education.sms.entity.Announcement;
import com.education.sms.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByTargetClassIdOrderByCreatedAtDesc(Long classId);

    List<Announcement> findByPostByUserIdOrderByCreatedAtDesc(Long userId);

    List<Announcement> findAllByOrderByCreatedAtDesc();

    List<Announcement> findByTargetClassIsNullOrderByCreatedAtDesc();

    List<Announcement> findByTargetRoleOrderByCreatedAtDesc(UserRole role);
    // General announcements (for all)
}
