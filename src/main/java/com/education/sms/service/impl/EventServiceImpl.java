package com.education.sms.service.impl;

import com.education.sms.dto.EventRequest;
import com.education.sms.dto.EventResponse;
import com.education.sms.entity.Event;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.EventRepository;
import com.education.sms.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    @Transactional
    public EventResponse createEvent(EventRequest request) {
        Event event = Event.builder()
                .title(request.title())
                .eventDate(request.eventDate())
                .description(request.description())
                .build();

        return toResponse(eventRepository.save(event));
    }

    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDate.now()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return toResponse(event);
    }

    @Override
    @Transactional
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    private EventResponse toResponse(Event entity) {
        return new EventResponse(
                entity.getEventId(),
                entity.getTitle(),
                entity.getEventDate(),
                entity.getDescription());
    }
}
