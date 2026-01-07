package com.education.sms.controller;

import com.education.sms.dto.CourseRequest;
import com.education.sms.dto.CourseResponse;
import com.education.sms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest request) {
        if (request.courseName() == null || request.courseName().isEmpty()) {
            return ResponseEntity.badRequest().body("Course name is required");
        }
        if (request.classId() == null) {
            return ResponseEntity.badRequest().body("Class ID is required");
        }

        try {
            return ResponseEntity.ok(courseService.createCourse(request));
        } catch (IllegalArgumentException | com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<CourseResponse>> getCoursesByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(courseService.getCoursesByClass(classId));
    }

    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<CourseResponse>> getCoursesByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(courseService.getCoursesByFaculty(facultyId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(courseService.getCourseById(id));
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{courseId}/faculty/{facultyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignFacultyToCourse(
            @PathVariable Long courseId,
            @PathVariable Long facultyId) {
        try {
            courseService.assignFacultyToCourse(courseId, facultyId);
            return ResponseEntity.ok("Faculty assigned to course successfully");
        } catch (com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
