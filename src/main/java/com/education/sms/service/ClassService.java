package com.education.sms.service;

import com.education.sms.dto.ClassRequest;
import com.education.sms.entity.ClassEntity;

import java.util.List;

public interface ClassService {
    ClassEntity createClass(ClassRequest request);
    List<ClassEntity> getAllClasses();
    ClassEntity getClassById(Long id);
    void assignStudentToClass(Long studentId, Long classId);
}
