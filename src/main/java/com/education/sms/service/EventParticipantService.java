package com.education.sms.service;

import com.education.sms.dto.EventParticipantRequest;
import com.education.sms.entity.EventParticipant;

import java.util.List;

public interface EventParticipantService {

    EventParticipant registerParticipant(EventParticipantRequest request);

    List<EventParticipant> getParticipantsByEvent(Long eventId);

    List<EventParticipant> getEventsByUser(Long userId);

    void removeParticipant(Long participantId);
}
