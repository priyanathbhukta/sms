package com.education.sms.controller;


import com.education.sms.dto.ClassRequest;
import com.education.sms.entity.ClassEntity;
import com.education.sms.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ClassService classService;

    @PutMapping("/assign/{studentId}/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignStudent(@PathVariable Long studentId, @PathVariable Long classId) {
        classService.assignStudentToClass(studentId, classId);
        return ResponseEntity.ok("Student assigned successfully");
    }
}
