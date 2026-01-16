package com.education.sms.service.impl;

import com.education.sms.dto.ClassRequest;
import com.education.sms.dto.ClassResponse;
import com.education.sms.entity.ClassEntity;
import com.education.sms.entity.Student;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.ClassEntityRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.service.ClassService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassEntityRepository classEntityRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public ClassResponse createClass(ClassRequest request) {
        // 1. Validation: Check if this class already exists
        if (classEntityRepository.existsByGradeLevelAndSectionAndAcademicYear(request.gradeLevel(), request.section(),
                request.academicYear())) {
            throw new IllegalArgumentException(
                    "Class already exists: " + request.gradeLevel() + "-" + request.section());
        }

        // 2. Create Entity from Request
        ClassEntity classEntity = ClassEntity.builder()
                .gradeLevel(request.gradeLevel())
                .section(request.section())
                .academicYear(request.academicYear())
                .build();

        // 3. Save to DB
        return toResponse(classEntityRepository.save(classEntity));
    }

    @Override
    public List<ClassResponse> getAllClasses() {
        return classEntityRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponse getClassById(Long id) {
        ClassEntity classEntity = classEntityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return toResponse(classEntity);
    }

    @Override
    @Transactional
    public void assignStudentToClass(Long studentId, Long classId) {
        // 1. Fetch Student
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // 2. Fetch Class
        ClassEntity classEntity = classEntityRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        // 3. Link them
        student.setClassEntity(classEntity);

        // 4. Save Student (Hibernate will update the Foreign Key 'class_id' in the
        // student table)
        studentRepository.save(student);
    }

    private ClassResponse toResponse(ClassEntity entity) {
        return new ClassResponse(
                entity.getId(),
                entity.getGradeLevel(),
                entity.getSection(),
                entity.getAddress(),
                entity.getAcademicYear());
    }
}
