package com.education.sms.service;

import com.education.sms.dto.BookRequestActionDTO;
import com.education.sms.dto.BookRequestCreateDTO;
import com.education.sms.dto.BookRequestResponse;
import com.education.sms.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface BookRequestService {

    /**
     * Create a new book request (Student only).
     */
    BookRequestResponse createRequest(BookRequestCreateDTO request);

    /**
     * Approve or reject a book request (Librarian only).
     */
    BookRequestResponse processRequest(BookRequestActionDTO action, Long librarianUserId);

    /**
     * Get all requests for a student.
     */
    PagedResponse<BookRequestResponse> getRequestsByStudent(Long studentId, Pageable pageable);

    /**
     * Get all pending requests (for Librarian dashboard).
     */
    PagedResponse<BookRequestResponse> getPendingRequests(Pageable pageable);

    /**
     * Get requests by status.
     */
    PagedResponse<BookRequestResponse> getRequestsByStatus(String status, Pageable pageable);

    /**
     * Get a single request by ID.
     */
    BookRequestResponse getRequestById(Long requestId);

    /**
     * Cancel a pending request (Student only - own request).
     */
    BookRequestResponse cancelRequest(Long requestId, Long studentId);
}
