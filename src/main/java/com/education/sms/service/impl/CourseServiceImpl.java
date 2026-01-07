package com.education.sms.service.impl;

import com.education.sms.dto.CourseRequest;
import com.education.sms.dto.CourseResponse;
import com.education.sms.entity.ClassEntity;
import com.education.sms.entity.Course;
import com.education.sms.entity.Faculty;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.ClassEntityRepository;
import com.education.sms.repository.CourseRepository;
import com.education.sms.repository.FacultyRepository;
import com.education.sms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ClassEntityRepository classEntityRepository;
    private final FacultyRepository facultyRepository;

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        // Validate class exists
        ClassEntity classEntity = classEntityRepository.findById(request.classId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.classId()));

        // Check for duplicate course name in the same class
        if (courseRepository.existsByCourseNameAndClassEntityId(request.courseName(), request.classId())) {
            throw new IllegalArgumentException("Course already exists in this class: " + request.courseName());
        }

        // Build course
        Course.CourseBuilder courseBuilder = Course.builder()
                .courseName(request.courseName())
                .classEntity(classEntity);

        // Optionally assign faculty
        if (request.facultyId() != null) {
            Faculty faculty = facultyRepository.findById(request.facultyId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Faculty not found with id: " + request.facultyId()));
            courseBuilder.faculty(faculty);
        }

        return toResponse(courseRepository.save(courseBuilder.build()));
    }

    @Override
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> getCoursesByClass(Long classId) {
        return courseRepository.findByClassEntityId(classId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> getCoursesByFaculty(Long facultyId) {
        return courseRepository.findByFacultyId(facultyId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        return toResponse(course);
    }

    @Override
    @Transactional
    public void assignFacultyToCourse(Long courseId, Long facultyId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + facultyId));

        course.setFaculty(faculty);
        courseRepository.save(course);
    }

    private CourseResponse toResponse(Course entity) {
        ClassEntity classEntity = entity.getClassEntity();
        Faculty faculty = entity.getFaculty();
        return new CourseResponse(
                entity.getCourseId(),
                entity.getCourseName(),
                classEntity != null ? classEntity.getId() : null,
                classEntity != null ? classEntity.getGradeLevel() + "-" + classEntity.getSection() : null,
                faculty != null ? faculty.getId() : null,
                faculty != null ? faculty.getFirstName() + " " + faculty.getLastName() : null);
    }
}
