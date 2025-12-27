package com.education.sms.repository;

import com.education.sms.entity.AdminRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRequestRepository extends JpaRepository<AdminRequest, Long> {

    List<AdminRequest> findByRequesterUserId(Long userId);

    List<AdminRequest> findByStatus(String status);

    List<AdminRequest> findByRequestType(String requestType);

    List<AdminRequest> findByStatusOrderByCreatedAtDesc(String status);
}
