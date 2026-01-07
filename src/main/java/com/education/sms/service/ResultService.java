package com.education.sms.service;

import com.education.sms.dto.ResultRequest;
import com.education.sms.dto.ResultResponse;

import java.util.List;

public interface ResultService {

    ResultResponse createOrUpdateResult(ResultRequest request);

    List<ResultResponse> getResultsByStudent(Long studentId);

    List<ResultResponse> getResultsByExam(Long examId);

    ResultResponse getResultByExamAndStudent(Long examId, Long studentId);

    void finalizeResult(Long resultId);
}
