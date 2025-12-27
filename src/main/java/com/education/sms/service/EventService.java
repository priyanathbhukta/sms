package com.education.sms.service;

import com.education.sms.dto.EventRequest;
import com.education.sms.entity.Event;

import java.time.LocalDate;
import java.util.List;

public interface EventService {

    Event createEvent(EventRequest request);

    List<Event> getAllEvents();

    List<Event> getUpcomingEvents();

    Event getEventById(Long eventId);

    void deleteEvent(Long eventId);
}
