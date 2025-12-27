package com.education.sms.service.impl;

import com.education.sms.dto.LibraryIssueRequest;
import com.education.sms.entity.Book;
import com.education.sms.entity.LibraryIssue;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.BookRepository;
import com.education.sms.repository.LibraryIssueRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.LibraryIssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryIssueServiceImpl implements LibraryIssueService {

    private final LibraryIssueRepository libraryIssueRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public LibraryIssue issueBook(LibraryIssueRequest request) {
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.bookId()));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));

        // Check availability
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies available for this book");
        }

        // Decrease available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LibraryIssue issue = LibraryIssue.builder()
                .book(book)
                .user(user)
                .build();

        return libraryIssueRepository.save(issue);
    }

    @Override
    @Transactional
    public LibraryIssue returnBook(Long issueId, BigDecimal fineAmount) {
        LibraryIssue issue = getIssueById(issueId);

        if ("returned".equals(issue.getStatus())) {
            throw new IllegalStateException("Book already returned");
        }

        // Update issue
        issue.setReturnDate(LocalDate.now());
        issue.setStatus("returned");
        if (fineAmount != null && fineAmount.compareTo(BigDecimal.ZERO) > 0) {
            issue.setFineAmount(fineAmount);
        }

        // Increase available copies
        Book book = issue.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return libraryIssueRepository.save(issue);
    }

    @Override
    public List<LibraryIssue> getIssuesByUser(Long userId) {
        return libraryIssueRepository.findByUserId(userId);
    }

    @Override
    public List<LibraryIssue> getIssuesByBook(Long bookId) {
        return libraryIssueRepository.findByBookBookId(bookId);
    }

    @Override
    public List<LibraryIssue> getOverdueIssues() {
        return libraryIssueRepository.findByStatus("overdue");
    }

    @Override
    public LibraryIssue getIssueById(Long issueId) {
        return libraryIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Library issue not found with id: " + issueId));
    }
}
