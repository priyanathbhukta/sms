package com.education.sms.repository;

import com.education.sms.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDate date); // Upcoming events

    List<Event> findByEventDateBetween(LocalDate startDate, LocalDate endDate);

    List<Event> findAllByOrderByEventDateDesc();
}
