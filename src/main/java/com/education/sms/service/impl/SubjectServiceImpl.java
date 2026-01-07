package com.education.sms.service.impl;

import com.education.sms.dto.SubjectRequest;
import com.education.sms.dto.SubjectResponse;
import com.education.sms.entity.ClassEntity;
import com.education.sms.entity.Faculty;
import com.education.sms.entity.Subject;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.ClassEntityRepository;
import com.education.sms.repository.FacultyRepository;
import com.education.sms.repository.SubjectRepository;
import com.education.sms.service.SubjectService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

        private final SubjectRepository subjectRepository;
        private final ClassEntityRepository classEntityRepository;
        private final FacultyRepository facultyRepository;

        @Override
        @Transactional
        public SubjectResponse createSubject(SubjectRequest request) {
                // 1. Fetch Class
                ClassEntity classEntity = classEntityRepository.findById(request.classId())
                                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

                // 2. Fetch Faculty
                Faculty faculty = facultyRepository.findById(request.facultyId())
                                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

                // 3. Build Subject
                Subject subject = Subject.builder()
                                .name(request.name())
                                .code(request.code())
                                .classEntity(classEntity)
                                .faculty(faculty)
                                .build();

                return toResponse(subjectRepository.save(subject));
        }

        @Override
        public List<SubjectResponse> getAllSubjects() {
                return subjectRepository.findAll().stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public SubjectResponse getSubjectById(Long id) {
                Subject subject = subjectRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
                return toResponse(subject);
        }

        private SubjectResponse toResponse(Subject entity) {
                return new SubjectResponse(
                                entity.getId(),
                                entity.getName(),
                                entity.getCode(),
                                entity.getClassEntity().getId(),
                                entity.getFaculty().getId());
        }
}
