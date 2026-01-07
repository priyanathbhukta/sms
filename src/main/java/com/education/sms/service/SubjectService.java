package com.education.sms.service;

import com.education.sms.dto.SubjectRequest;
import com.education.sms.dto.SubjectResponse;

import java.util.List;

public interface SubjectService {
    SubjectResponse createSubject(SubjectRequest request);

    List<SubjectResponse> getAllSubjects();

    SubjectResponse getSubjectById(Long id);
}
