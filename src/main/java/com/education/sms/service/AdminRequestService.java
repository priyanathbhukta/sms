package com.education.sms.service;

import com.education.sms.dto.AdminRequestRequest;
import com.education.sms.entity.AdminRequest;

import java.util.List;

public interface AdminRequestService {

    AdminRequest createAdminRequest(AdminRequestRequest request);

    AdminRequest updateStatus(Long requestId, String status, String adminComments);

    List<AdminRequest> getAllRequests();

    List<AdminRequest> getRequestsByUser(Long userId);

    List<AdminRequest> getRequestsByStatus(String status);

    AdminRequest getRequestById(Long requestId);
}
