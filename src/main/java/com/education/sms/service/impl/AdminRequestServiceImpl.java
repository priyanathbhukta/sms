package com.education.sms.service.impl;

import com.education.sms.dto.AdminRequestRequest;
import com.education.sms.dto.AdminRequestResponse;
import com.education.sms.entity.AdminRequest;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.AdminRequestRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.AdminRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminRequestServiceImpl implements AdminRequestService {

    private final AdminRequestRepository adminRequestRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public AdminRequestResponse createAdminRequest(AdminRequestRequest request) {
        User requester = userRepository.findById(request.requesterUserId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("User not found with id: " + request.requesterUserId()));

        AdminRequest adminRequest = AdminRequest.builder()
                .requesterUser(requester)
                .requestType(request.requestType())
                .description(request.description())
                .previousDate(request.previousDate())
                .newDate(request.newDate())
                .requestDocumentUrl(request.requestDocumentUrl())
                .build();

        return toResponse(adminRequestRepository.save(adminRequest));
    }

    @Override
    @Transactional
    public AdminRequestResponse updateStatus(Long requestId, String status, String adminComments) {
        AdminRequest request = adminRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin request not found with id: " + requestId));
        request.setStatus(status);
        if (adminComments != null) {
            request.setAdminComments(adminComments);
        }
        return toResponse(adminRequestRepository.save(request));
    }

    @Override
    public List<AdminRequestResponse> getAllRequests() {
        return adminRequestRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminRequestResponse> getRequestsByUser(Long userId) {
        return adminRequestRepository.findByRequesterUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminRequestResponse> getRequestsByStatus(String status) {
        return adminRequestRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminRequestResponse getRequestById(Long requestId) {
        AdminRequest request = adminRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin request not found with id: " + requestId));
        return toResponse(request);
    }

    private AdminRequestResponse toResponse(AdminRequest entity) {
        return new AdminRequestResponse(
                entity.getRequestId(),
                entity.getRequesterUser().getId(),
                entity.getRequesterUser().getEmail(),
                entity.getRequestType(),
                entity.getDescription(),
                entity.getPreviousDate(),
                entity.getNewDate(),
                entity.getRequestDocumentUrl(),
                entity.getStatus(),
                entity.getAdminComments(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
