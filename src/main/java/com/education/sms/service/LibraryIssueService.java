package com.education.sms.service;

import com.education.sms.dto.LibraryIssueRequest;
import com.education.sms.entity.LibraryIssue;

import java.math.BigDecimal;
import java.util.List;

public interface LibraryIssueService {

    LibraryIssue issueBook(LibraryIssueRequest request);

    LibraryIssue returnBook(Long issueId, BigDecimal fineAmount);

    List<LibraryIssue> getIssuesByUser(Long userId);

    List<LibraryIssue> getIssuesByBook(Long bookId);

    List<LibraryIssue> getOverdueIssues();

    LibraryIssue getIssueById(Long issueId);
}
