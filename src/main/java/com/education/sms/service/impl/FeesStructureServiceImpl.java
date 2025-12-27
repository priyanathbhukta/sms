package com.education.sms.service.impl;

import com.education.sms.dto.FeesStructureRequest;
import com.education.sms.entity.ClassEntity;
import com.education.sms.entity.FeesStructure;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.ClassEntityRepository;
import com.education.sms.repository.FeesStructureRepository;
import com.education.sms.service.FeesStructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeesStructureServiceImpl implements FeesStructureService {

    private final FeesStructureRepository feesStructureRepository;
    private final ClassEntityRepository classEntityRepository;

    @Override
    @Transactional
    public FeesStructure createFeesStructure(FeesStructureRequest request) {
        ClassEntity classEntity = classEntityRepository.findById(request.classId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.classId()));

        // Check for duplicate fee type for the same class
        if (feesStructureRepository.existsByClassEntityIdAndFeeType(request.classId(), request.feeType())) {
            throw new IllegalArgumentException(
                    "Fee structure already exists for class " + request.classId() + " with type: " + request.feeType());
        }

        FeesStructure feesStructure = FeesStructure.builder()
                .classEntity(classEntity)
                .amount(request.amount())
                .feeType(request.feeType())
                .build();

        return feesStructureRepository.save(feesStructure);
    }

    @Override
    public List<FeesStructure> getAllFeesStructures() {
        return feesStructureRepository.findAll();
    }

    @Override
    public List<FeesStructure> getFeesStructuresByClass(Long classId) {
        return feesStructureRepository.findByClassEntityId(classId);
    }

    @Override
    public FeesStructure getFeesStructureById(Long feeId) {
        return feesStructureRepository.findById(feeId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + feeId));
    }

    @Override
    @Transactional
    public void deleteFeesStructure(Long feeId) {
        if (!feesStructureRepository.existsById(feeId)) {
            throw new ResourceNotFoundException("Fee structure not found with id: " + feeId);
        }
        feesStructureRepository.deleteById(feeId);
    }
}
