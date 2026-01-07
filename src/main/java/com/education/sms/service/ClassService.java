package com.education.sms.service;

import com.education.sms.dto.ClassRequest;
import com.education.sms.dto.ClassResponse;

import java.util.List;

public interface ClassService {
    ClassResponse createClass(ClassRequest request);

    List<ClassResponse> getAllClasses();

    ClassResponse getClassById(Long id);

    void assignStudentToClass(Long studentId, Long classId);
}
