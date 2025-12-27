package com.education.sms.service.impl;

import com.education.sms.dto.AdminRequestRequest;
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

@Service
@RequiredArgsConstructor
public class AdminRequestServiceImpl implements AdminRequestService {

    private final AdminRequestRepository adminRequestRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public AdminRequest createAdminRequest(AdminRequestRequest request) {
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

        return adminRequestRepository.save(adminRequest);
    }

    @Override
    @Transactional
    public AdminRequest updateStatus(Long requestId, String status, String adminComments) {
        AdminRequest request = getRequestById(requestId);
        request.setStatus(status);
        if (adminComments != null) {
            request.setAdminComments(adminComments);
        }
        return adminRequestRepository.save(request);
    }

    @Override
    public List<AdminRequest> getAllRequests() {
        return adminRequestRepository.findAll();
    }

    @Override
    public List<AdminRequest> getRequestsByUser(Long userId) {
        return adminRequestRepository.findByRequesterUserId(userId);
    }

    @Override
    public List<AdminRequest> getRequestsByStatus(String status) {
        return adminRequestRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    @Override
    public AdminRequest getRequestById(Long requestId) {
        return adminRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin request not found with id: " + requestId));
    }
}
