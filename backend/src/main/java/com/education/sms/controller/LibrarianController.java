package com.education.sms.controller;

import com.education.sms.dto.LibrarianSummaryResponse;
import com.education.sms.dto.RegisterRequest;
import com.education.sms.entity.Librarian;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.LibrarianRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.LibrarianService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/librarians")
@RequiredArgsConstructor
@Tag(name = "Librarians", description = "Librarian management endpoints")
public class LibrarianController {

    private final LibrarianService librarianService;
    private final LibrarianRepository librarianRepository;
    private final UserRepository userRepository;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createLibrarian(@RequestBody RegisterRequest request) {
        try {
            librarianService.createLibrarian(request);
            return ResponseEntity.ok("Librarian created successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get librarian by ID")
    public ResponseEntity<LibrarianSummaryResponse> getLibrarianById(@PathVariable Long id) {
        Librarian librarian = librarianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Librarian not found with id: " + id));
        return ResponseEntity.ok(mapToSummaryResponse(librarian));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update librarian")
    public ResponseEntity<?> updateLibrarian(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Librarian librarian = librarianRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Librarian not found with id: " + id));

            if (request.get("firstName") != null && !request.get("firstName").isBlank()) {
                librarian.setFirstName(request.get("firstName").trim());
            }
            if (request.get("lastName") != null && !request.get("lastName").isBlank()) {
                librarian.setLastName(request.get("lastName").trim());
            }
            if (request.containsKey("phone")) {
                String phone = request.get("phone");
                librarian.setPhone(phone != null && !phone.isBlank() ? phone.trim() : null);
            }

            Librarian saved = librarianRepository.save(librarian);
            return ResponseEntity.ok(Map.of(
                    "message", "Librarian updated successfully",
                    "librarian", mapToSummaryResponse(saved)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to update librarian: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete librarian")
    public ResponseEntity<?> deleteLibrarian(@PathVariable Long id) {
        try {
            Librarian librarian = librarianRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Librarian not found with id: " + id));

            User user = librarian.getUser();
            librarianRepository.delete(librarian);

            if (user != null) {
                userRepository.delete(user);
            }

            return ResponseEntity.ok(Map.of("message", "Librarian deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    private LibrarianSummaryResponse mapToSummaryResponse(Librarian librarian) {
        return new LibrarianSummaryResponse(
                librarian.getId(),
                librarian.getId(),
                librarian.getFirstName(),
                librarian.getLastName(),
                librarian.getFirstName() + " " + librarian.getLastName(),
                librarian.getUser() != null ? librarian.getUser().getEmail() : null,
                librarian.getEmployeeId(),
                librarian.getPhone(),
                librarian.getUser() != null ? librarian.getUser().getProfileImageUrl() : null);
    }
}
