package com.education.sms.service.impl;

import com.education.sms.dto.FeesStructureRequest;
import com.education.sms.dto.FeesStructureResponse;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeesStructureServiceImpl implements FeesStructureService {

    private final FeesStructureRepository feesStructureRepository;
    private final ClassEntityRepository classEntityRepository;

    @Override
    @Transactional
    public FeesStructureResponse createFeesStructure(FeesStructureRequest request) {
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

        return toResponse(feesStructureRepository.save(feesStructure));
    }

    @Override
    public List<FeesStructureResponse> getAllFeesStructures() {
        return feesStructureRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeesStructureResponse> getFeesStructuresByClass(Long classId) {
        return feesStructureRepository.findByClassEntityId(classId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FeesStructureResponse getFeesStructureById(Long feeId) {
        FeesStructure feesStructure = feesStructureRepository.findById(feeId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + feeId));
        return toResponse(feesStructure);
    }

    @Override
    @Transactional
    public void deleteFeesStructure(Long feeId) {
        if (!feesStructureRepository.existsById(feeId)) {
            throw new ResourceNotFoundException("Fee structure not found with id: " + feeId);
        }
        feesStructureRepository.deleteById(feeId);
    }

    private FeesStructureResponse toResponse(FeesStructure entity) {
        ClassEntity classEntity = entity.getClassEntity();
        return new FeesStructureResponse(
                entity.getFeeId(),
                classEntity != null ? classEntity.getId() : null,
                classEntity != null ? classEntity.getGradeLevel() + "-" + classEntity.getSection() : null,
                entity.getAmount(),
                entity.getFeeType());
    }
}
