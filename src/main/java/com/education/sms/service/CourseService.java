package com.education.sms.service;

import com.education.sms.dto.CourseRequest;
import com.education.sms.dto.CourseResponse;

import java.util.List;

public interface CourseService {

    CourseResponse createCourse(CourseRequest request);

    List<CourseResponse> getAllCourses();

    List<CourseResponse> getCoursesByClass(Long classId);

    List<CourseResponse> getCoursesByFaculty(Long facultyId);

    CourseResponse getCourseById(Long courseId);

    void assignFacultyToCourse(Long courseId, Long facultyId);
}
