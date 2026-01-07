package com.education.sms.service;

import com.education.sms.dto.FeesStructureRequest;
import com.education.sms.dto.FeesStructureResponse;

import java.util.List;

public interface FeesStructureService {

    FeesStructureResponse createFeesStructure(FeesStructureRequest request);

    List<FeesStructureResponse> getAllFeesStructures();

    List<FeesStructureResponse> getFeesStructuresByClass(Long classId);

    FeesStructureResponse getFeesStructureById(Long feeId);

    void deleteFeesStructure(Long feeId);
}
