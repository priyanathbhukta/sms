package com.education.sms.service.impl;

import com.education.sms.dto.*;
import com.education.sms.entity.Faculty;
import com.education.sms.entity.Librarian;
import com.education.sms.entity.Student;
import com.education.sms.repository.*;
import com.education.sms.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserManagementServiceImpl implements UserManagementService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final LibrarianRepository librarianRepository;
    private final AdminRequestRepository adminRequestRepository;
    private final BookRequestRepository bookRequestRepository;
    private final ClassEntityRepository classEntityRepository;
    private final CourseRepository courseRepository;

    @Override
    public PagedResponse<StudentSummaryResponse> getAllStudents(Pageable pageable) {
        Page<Student> page = studentRepository.findAll(pageable);
        return PagedResponse.from(page.map(this::mapStudentToSummary));
    }

    @Override
    public PagedResponse<StudentSummaryResponse> searchStudents(String name, Pageable pageable) {
        Page<Student> page = studentRepository.searchByName(name, pageable);
        return PagedResponse.from(page.map(this::mapStudentToSummary));
    }

    @Override
    public PagedResponse<FacultySummaryResponse> getAllFaculty(Pageable pageable) {
        Page<Faculty> page = facultyRepository.findAll(pageable);
        return PagedResponse.from(page.map(this::mapFacultyToSummary));
    }

    @Override
    public PagedResponse<FacultySummaryResponse> searchFaculty(String name, Pageable pageable) {
        // Use the derived query method
        Page<Faculty> page = facultyRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name,
                name, pageable);
        return PagedResponse.from(page.map(this::mapFacultyToSummary));
    }

    @Override
    public PagedResponse<LibrarianSummaryResponse> getAllLibrarians(Pageable pageable) {
        Page<Librarian> page = librarianRepository.findAll(pageable);
        return PagedResponse.from(page.map(this::mapLibrarianToSummary));
    }

    @Override
    public AdminDashboardStats getDashboardStats() {
        return new AdminDashboardStats(
                studentRepository.countAllStudents(),
                facultyRepository.countAllFaculty(),
                librarianRepository.countAllLibrarians(),
                adminRequestRepository.countByStatus("pending"),
                bookRequestRepository.countPendingRequests(),
                classEntityRepository.count(),
                courseRepository.count());
    }

    private StudentSummaryResponse mapStudentToSummary(Student student) {
        String className = student.getClassEntity() != null
                ? student.getClassEntity().getGradeLevel() + " - " + student.getClassEntity().getSection()
                : "Not Assigned";

        Long classId = student.getClassEntity() != null ? student.getClassEntity().getId() : null;

        // Extract enrollment year from email (format:
        // firstName.lastName.YEAR@sms.edu.in)
        String enrollmentYear = null;
        String email = student.getUser() != null ? student.getUser().getEmail() : null;
        if (email != null && email.contains("@sms.edu.in")) {
            String[] parts = email.split("@")[0].split("\\.");
            if (parts.length >= 3) {
                enrollmentYear = parts[parts.length - 1]; // Last part before @ is the year
            }
        }

        return new StudentSummaryResponse(
                student.getStudentId(),
                student.getStudentId(),
                student.getFirstName(),
                student.getLastName(),
                student.getFirstName() + " " + student.getLastName(),
                student.getRegistrationNumber(),
                email,
                enrollmentYear,
                className,
                classId,
                student.getParentPhone(),
                student.getAddress());
    }

    private FacultySummaryResponse mapFacultyToSummary(Faculty faculty) {
        return new FacultySummaryResponse(
                faculty.getId(),
                faculty.getFirstName(),
                faculty.getLastName(),
                faculty.getFirstName() + " " + faculty.getLastName(),
                faculty.getUser() != null ? faculty.getUser().getEmail() : null,
                faculty.getDepartment(),
                faculty.getEmployeeId(),
                faculty.getPhone(),
                faculty.getUser() != null ? faculty.getUser().getProfileImageUrl() : null);
    }

    private LibrarianSummaryResponse mapLibrarianToSummary(Librarian librarian) {
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
