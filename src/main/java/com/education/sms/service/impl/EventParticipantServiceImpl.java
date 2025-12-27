package com.education.sms.service.impl;

import com.education.sms.dto.EventParticipantRequest;
import com.education.sms.entity.Event;
import com.education.sms.entity.EventParticipant;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.EventParticipantRepository;
import com.education.sms.repository.EventRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.EventParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventParticipantServiceImpl implements EventParticipantService {

    private final EventParticipantRepository eventParticipantRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public EventParticipant registerParticipant(EventParticipantRequest request) {
        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.eventId()));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));

        // Check if already registered
        if (eventParticipantRepository.existsByEventEventIdAndUserId(request.eventId(), request.userId())) {
            throw new IllegalArgumentException("User already registered for this event");
        }

        EventParticipant participant = EventParticipant.builder()
                .event(event)
                .user(user)
                .role(request.role())
                .build();

        return eventParticipantRepository.save(participant);
    }

    @Override
    public List<EventParticipant> getParticipantsByEvent(Long eventId) {
        return eventParticipantRepository.findByEventEventId(eventId);
    }

    @Override
    public List<EventParticipant> getEventsByUser(Long userId) {
        return eventParticipantRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void removeParticipant(Long participantId) {
        if (!eventParticipantRepository.existsById(participantId)) {
            throw new ResourceNotFoundException("Participant not found with id: " + participantId);
        }
        eventParticipantRepository.deleteById(participantId);
    }
}
