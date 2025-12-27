package com.education.sms.service;

import com.education.sms.dto.FeesStructureRequest;
import com.education.sms.entity.FeesStructure;

import java.util.List;

public interface FeesStructureService {

    FeesStructure createFeesStructure(FeesStructureRequest request);

    List<FeesStructure> getAllFeesStructures();

    List<FeesStructure> getFeesStructuresByClass(Long classId);

    FeesStructure getFeesStructureById(Long feeId);

    void deleteFeesStructure(Long feeId);
}
