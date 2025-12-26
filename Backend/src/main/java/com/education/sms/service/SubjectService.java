package com.education.sms.service;

import com.education.sms.dto.SubjectRequest;
import com.education.sms.dto.SubjectResponse;
import com.education.sms.entity.Subject;

import java.util.List;

public interface SubjectService {
    Subject createSubject(SubjectRequest request);
    List<SubjectResponse> getAllSubjects();
    SubjectResponse getSubjectById(Long id);

}
