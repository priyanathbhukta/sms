package com.education.sms.controller;

import com.education.sms.dto.*;
import com.education.sms.entity.Faculty;
import com.education.sms.entity.Student;
import com.education.sms.entity.Subject;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculty/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FACULTY')")
@Tag(name = "Faculty Dashboard", description = "Academic management dashboard for faculty")
public class FacultyDashboardController {

        private final FacultyRepository facultyRepository;
        private final SubjectRepository subjectRepository;
        private final StudentRepository studentRepository;
        private final ExamRepository examRepository;
        private final ClassEntityRepository classEntityRepository;

        @GetMapping("/my-classes")
        @Operation(summary = "Get my classes", description = "Get classes where faculty teaches subjects")
        public ResponseEntity<?> getMyClasses(@Parameter(hidden = true) @AuthenticationPrincipal User user) {
                Faculty faculty = facultyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

                // Get classes from subjects where this faculty teaches
                List<Subject> subjects = subjectRepository.findByFacultyId(faculty.getId());

                var classes = subjects.stream()
                                .filter(s -> s.getClassEntity() != null)
                                .map(s -> s.getClassEntity())
                                .distinct()
                                .map(c -> new ClassSummary(
                                                c.getId(),
                                                c.getGradeLevel(),
                                                c.getSection(),
                                                studentRepository.countByClassId(c.getId())))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(classes);
        }

        @GetMapping("/my-students")
        @Operation(summary = "Get my students", description = "Paginated students from classes where faculty teaches")
        public ResponseEntity<PagedResponse<StudentSummaryResponse>> getMyStudents(
                        @Parameter(hidden = true) @AuthenticationPrincipal User user,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

                Faculty faculty = facultyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

                // Get class IDs from subjects where this faculty teaches
                List<Subject> subjects = subjectRepository.findByFacultyId(faculty.getId());

                List<Long> classIds = subjects.stream()
                                .filter(s -> s.getClassEntity() != null)
                                .map(s -> s.getClassEntity().getId())
                                .distinct()
                                .collect(Collectors.toList());

                if (classIds.isEmpty()) {
                        return ResponseEntity.ok(new PagedResponse<>(List.of(), page, size, 0, 0, true, true));
                }

                // Get first class's students (simplified - ideally should aggregate)
                Pageable pageable = PageRequest.of(page, size);
                Page<Student> studentPage = studentRepository.findByClassEntityId(classIds.get(0), pageable);

                var response = PagedResponse.from(studentPage.map(this::mapToStudentSummary));
                return ResponseEntity.ok(response);
        }

        @GetMapping("/class/{classId}/students")
        @Operation(summary = "Get students in class", description = "Get students in a specific class (if faculty teaches there)")
        public ResponseEntity<?> getStudentsInClass(
                        @Parameter(hidden = true) @AuthenticationPrincipal User user,
                        @PathVariable Long classId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

                Faculty faculty = facultyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

                // Verify faculty teaches in this class
                List<Subject> subjects = subjectRepository.findByFacultyId(faculty.getId());
                boolean hasAccess = subjects.stream()
                                .filter(s -> s.getClassEntity() != null)
                                .anyMatch(s -> s.getClassEntity().getId().equals(classId));

                if (!hasAccess) {
                        return ResponseEntity.status(403).body("You do not have access to this class");
                }

                Pageable pageable = PageRequest.of(page, size);
                Page<Student> studentPage = studentRepository.findByClassEntityId(classId, pageable);

                var response = PagedResponse.from(studentPage.map(this::mapToStudentSummary));
                return ResponseEntity.ok(response);
        }

        @GetMapping("/stats")
        @Operation(summary = "Get dashboard stats", description = "Faculty dashboard with academic statistics")
        public ResponseEntity<FacultyDashboardStats> getDashboardStats(
                        @Parameter(hidden = true) @AuthenticationPrincipal User user) {
                Faculty faculty = facultyRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

                List<Subject> subjects = subjectRepository.findByFacultyId(faculty.getId());

                var classSummaries = subjects.stream()
                                .filter(s -> s.getClassEntity() != null)
                                .map(s -> s.getClassEntity())
                                .distinct()
                                .map(c -> new ClassSummary(
                                                c.getId(),
                                                c.getGradeLevel(),
                                                c.getSection(),
                                                studentRepository.countByClassId(c.getId())))
                                .collect(Collectors.toList());

                long totalStudents = classSummaries.stream()
                                .mapToLong(ClassSummary::studentCount)
                                .sum();

                var stats = new FacultyDashboardStats(
                                classSummaries.size(),
                                totalStudents,
                                0L, // upcomingExams - simplified
                                0L, // pendingResults - simplified
                                classSummaries);

                return ResponseEntity.ok(stats);
        }

        private StudentSummaryResponse mapToStudentSummary(Student student) {
                String className = student.getClassEntity() != null
                                ? student.getClassEntity().getGradeLevel() + " - "
                                                + student.getClassEntity().getSection()
                                : "Not Assigned";

                return new StudentSummaryResponse(
                                student.getStudentId(),
                                student.getFirstName(),
                                student.getLastName(),
                                student.getFirstName() + " " + student.getLastName(),
                                student.getRegistrationNumber(),
                                student.getUser() != null ? student.getUser().getEmail() : null,
                                className,
                                student.getParentPhone());
        }
}
