package com.education.sms.repository;

import com.education.sms.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

    List<EventParticipant> findByEventEventId(Long eventId);

    List<EventParticipant> findByUserId(Long userId);

    Optional<EventParticipant> findByEventEventIdAndUserId(Long eventId, Long userId);

    boolean existsByEventEventIdAndUserId(Long eventId, Long userId);
}
