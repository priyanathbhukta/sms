package com.education.sms.service;

import com.education.sms.dto.AdminRequestRequest;
import com.education.sms.dto.AdminRequestResponse;

import java.util.List;

public interface AdminRequestService {

    AdminRequestResponse createAdminRequest(AdminRequestRequest request);

    AdminRequestResponse updateStatus(Long requestId, String status, String adminComments);

    List<AdminRequestResponse> getAllRequests();

    List<AdminRequestResponse> getRequestsByUser(Long userId);

    List<AdminRequestResponse> getRequestsByStatus(String status);

    AdminRequestResponse getRequestById(Long requestId);
}
