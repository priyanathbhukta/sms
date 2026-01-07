package com.education.sms.controller;

import com.education.sms.dto.AnnouncementRequest;
import com.education.sms.dto.AnnouncementResponse;
import com.education.sms.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<?> createAnnouncement(@RequestBody AnnouncementRequest request) {
        if (request.title() == null || request.content() == null || request.postByUserId() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        try {
            return ResponseEntity.ok(announcementService.createAnnouncement(request));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT', 'LIBRARIAN')")
    public ResponseEntity<List<AnnouncementResponse>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(announcementService.getAnnouncementsByClass(classId));
    }

    @GetMapping("/general")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT', 'LIBRARIAN')")
    public ResponseEntity<List<AnnouncementResponse>> getGeneralAnnouncements() {
        // Get current user's role from SecurityContext
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        String roleName = auth.getAuthorities().stream().findFirst().get().getAuthority().replace("ROLE_", "");
        com.education.sms.entity.UserRole role = com.education.sms.entity.UserRole.valueOf(roleName);

        return ResponseEntity.ok(announcementService.getAnnouncementsForFeed(role));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(announcementService.getAnnouncementById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            return ResponseEntity.ok("Announcement deleted successfully");
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
