package com.education.sms.controller;

import com.education.sms.dto.CourseRequest;
import com.education.sms.entity.Course;
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
    public ResponseEntity<Course> createCourse(@RequestBody CourseRequest request) {
        if (request.courseName() == null || request.courseName().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (request.classId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            return ResponseEntity.ok(courseService.createCourse(request));
        } catch (IllegalArgumentException | com.education.sms.exception.ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<List<Course>> getCoursesByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(courseService.getCoursesByClass(classId));
    }

    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<Course>> getCoursesByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(courseService.getCoursesByFaculty(facultyId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
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
