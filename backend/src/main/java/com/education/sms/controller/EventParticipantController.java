package com.education.sms.controller;

import com.education.sms.dto.EventParticipantRequest;
import com.education.sms.dto.EventParticipantResponse;
import com.education.sms.service.EventParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-participants")
@RequiredArgsConstructor
public class EventParticipantController {

    private final EventParticipantService eventParticipantService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<?> registerParticipant(@RequestBody EventParticipantRequest request) {
        if (request.eventId() == null || request.userId() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            return ResponseEntity.ok(eventParticipantService.registerParticipant(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<EventParticipantResponse>> getParticipantsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventParticipantService.getParticipantsByEvent(eventId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<EventParticipantResponse>> getEventsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(eventParticipantService.getEventsByUser(userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<String> removeParticipant(@PathVariable Long id) {
        try {
            eventParticipantService.removeParticipant(id);
            return ResponseEntity.ok("Participant removed successfully");
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
