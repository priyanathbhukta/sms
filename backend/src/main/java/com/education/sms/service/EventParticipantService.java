package com.education.sms.service;

import com.education.sms.dto.EventParticipantRequest;
import com.education.sms.dto.EventParticipantResponse;

import java.util.List;

public interface EventParticipantService {

    EventParticipantResponse registerParticipant(EventParticipantRequest request);

    List<EventParticipantResponse> getParticipantsByEvent(Long eventId);

    List<EventParticipantResponse> getEventsByUser(Long userId);

    void removeParticipant(Long participantId);
}
