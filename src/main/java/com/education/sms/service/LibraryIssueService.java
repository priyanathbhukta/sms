package com.education.sms.service;

import com.education.sms.dto.LibraryIssueRequest;
import com.education.sms.dto.LibraryIssueResponse;

import java.math.BigDecimal;
import java.util.List;

public interface LibraryIssueService {

    LibraryIssueResponse issueBook(LibraryIssueRequest request);

    LibraryIssueResponse returnBook(Long issueId, BigDecimal fineAmount);

    List<LibraryIssueResponse> getIssuesByUser(Long userId);

    List<LibraryIssueResponse> getIssuesByBook(Long bookId);

    List<LibraryIssueResponse> getOverdueIssues();

    LibraryIssueResponse getIssueById(Long issueId);
}
