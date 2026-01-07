package com.education.sms.repository;

import com.education.sms.entity.LibraryIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryIssueRepository extends JpaRepository<LibraryIssue, Long> {

    List<LibraryIssue> findByUserId(Long userId);

    List<LibraryIssue> findByBookBookId(Long bookId);

    List<LibraryIssue> findByStatus(String status);

    List<LibraryIssue> findByUserIdAndStatus(Long userId, String status);

    long countByBookBookIdAndStatus(Long bookId, String status);

    @org.springframework.data.jpa.repository.Query("SELECT li FROM LibraryIssue li WHERE li.dueDate < CURRENT_DATE AND li.status = 'issued'")
    java.util.List<LibraryIssue> findOverdueIssues();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(li) FROM LibraryIssue li WHERE li.dueDate < CURRENT_DATE AND li.status = 'issued'")
    long countOverdueIssues();
}
