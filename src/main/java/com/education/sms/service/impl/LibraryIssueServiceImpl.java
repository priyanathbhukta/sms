package com.education.sms.service.impl;

import com.education.sms.dto.LibraryIssueRequest;
import com.education.sms.dto.LibraryIssueResponse;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LibraryIssueServiceImpl implements LibraryIssueService {

    private final LibraryIssueRepository libraryIssueRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public LibraryIssueResponse issueBook(LibraryIssueRequest request) {
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.bookId()));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));

        // Validate Role: Only Students and Faculties can borrow books
        if (user.getRole() != com.education.sms.entity.UserRole.STUDENT &&
                user.getRole() != com.education.sms.entity.UserRole.FACULTY) {
            throw new IllegalStateException("Books can only be issued to Students or Faculty members");
        }

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
                .issueDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(15)) // Default 15 days due date
                .status("issued")
                .build();

        return toResponse(libraryIssueRepository.save(issue));
    }

    @Override
    @Transactional
    public LibraryIssueResponse returnBook(Long issueId, BigDecimal fineAmount) {
        LibraryIssue issue = libraryIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Library issue not found with id: " + issueId));

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

        return toResponse(libraryIssueRepository.save(issue));
    }

    @Override
    public List<LibraryIssueResponse> getIssuesByUser(Long userId) {
        return libraryIssueRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LibraryIssueResponse> getIssuesByBook(Long bookId) {
        return libraryIssueRepository.findByBookBookId(bookId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LibraryIssueResponse> getOverdueIssues() {
        // Use the custom query to find issues past due date and not returned
        return libraryIssueRepository.findOverdueIssues().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LibraryIssueResponse getIssueById(Long issueId) {
        LibraryIssue issue = libraryIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Library issue not found with id: " + issueId));
        return toResponse(issue);
    }

    private LibraryIssueResponse toResponse(LibraryIssue entity) {
        return new LibraryIssueResponse(
                entity.getIssueId(),
                entity.getBook().getBookId(),
                entity.getBook().getTitle(),
                entity.getUser().getId(),
                entity.getUser().getEmail(),
                entity.getIssueDate(),
                entity.getReturnDate(),
                entity.getFineAmount(),
                entity.getStatus());
    }
}
