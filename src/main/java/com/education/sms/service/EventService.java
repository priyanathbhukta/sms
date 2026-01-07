package com.education.sms.service;

import com.education.sms.dto.EventRequest;
import com.education.sms.dto.EventResponse;

import java.util.List;

public interface EventService {

    EventResponse createEvent(EventRequest request);

    List<EventResponse> getAllEvents();

    List<EventResponse> getUpcomingEvents();

    EventResponse getEventById(Long eventId);

    void deleteEvent(Long eventId);
}
