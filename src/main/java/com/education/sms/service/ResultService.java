package com.education.sms.service;

import com.education.sms.dto.ResultRequest;
import com.education.sms.dto.ResultResponse;
import com.education.sms.entity.Result;

import java.util.List;

public interface ResultService {

    Result createOrUpdateResult(ResultRequest request);

    List<ResultResponse> getResultsByStudent(Long studentId);

    List<ResultResponse> getResultsByExam(Long examId);

    ResultResponse getResultByExamAndStudent(Long examId, Long studentId);

    void finalizeResult(Long resultId);
}
