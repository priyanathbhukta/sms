package com.education.sms.service;

import com.education.sms.dto.CourseRequest;
import com.education.sms.entity.Course;

import java.util.List;

public interface CourseService {

    Course createCourse(CourseRequest request);

    List<Course> getAllCourses();

    List<Course> getCoursesByClass(Long classId);

    List<Course> getCoursesByFaculty(Long facultyId);

    Course getCourseById(Long courseId);

    void assignFacultyToCourse(Long courseId, Long facultyId);
}
