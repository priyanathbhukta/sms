package com.education.sms.service.impl;

import com.education.sms.dto.BookRequestActionDTO;
import com.education.sms.dto.BookRequestCreateDTO;
import com.education.sms.dto.BookRequestResponse;
import com.education.sms.dto.PagedResponse;
import com.education.sms.entity.Book;
import com.education.sms.entity.BookRequest;
import com.education.sms.entity.Student;
import com.education.sms.entity.User;
import com.education.sms.exception.ResourceNotFoundException;
import com.education.sms.repository.BookRepository;
import com.education.sms.repository.BookRequestRepository;
import com.education.sms.repository.StudentRepository;
import com.education.sms.repository.UserRepository;
import com.education.sms.service.BookRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class BookRequestServiceImpl implements BookRequestService {

    private final BookRequestRepository bookRequestRepository;
    private final StudentRepository studentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    public BookRequestResponse createRequest(BookRequestCreateDTO request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.studentId()));

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.bookId()));

        // Check if student already has a pending request for this book
        var existingPending = bookRequestRepository.findByStudentStudentIdAndStatus(request.studentId(), "PENDING");
        if (existingPending.stream().anyMatch(br -> br.getBook().getBookId().equals(request.bookId()))) {
            throw new IllegalStateException("You already have a pending request for this book");
        }

        // Check book availability
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies available for this book");
        }

        BookRequest bookRequest = BookRequest.builder()
                .student(student)
                .book(book)
                .requestDate(LocalDateTime.now())
                .status("PENDING")
                .remarks(request.remarks())
                .build();

        BookRequest saved = bookRequestRepository.save(bookRequest);
        return mapToResponse(saved);
    }

    @Override
    public BookRequestResponse processRequest(BookRequestActionDTO action, Long librarianUserId) {
        BookRequest bookRequest = bookRequestRepository.findById(action.requestId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Book request not found with id: " + action.requestId()));

        if (!"PENDING".equals(bookRequest.getStatus())) {
            throw new IllegalStateException("Only pending requests can be processed");
        }

        User librarian = userRepository.findById(librarianUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String actionType = action.action().toUpperCase();

        switch (actionType) {
            case "APPROVE" -> {
                Book book = bookRequest.getBook();
                if (book.getAvailableCopies() <= 0) {
                    throw new IllegalStateException("No copies available to approve this request");
                }
                bookRequest.setStatus("APPROVED");
                bookRequest.setApprovedBy(librarian);
                bookRequest.setApprovedDate(LocalDateTime.now());
            }
            case "REJECT" -> {
                bookRequest.setStatus("REJECTED");
                bookRequest.setApprovedBy(librarian);
                bookRequest.setApprovedDate(LocalDateTime.now());
            }
            default -> throw new IllegalArgumentException("Invalid action: " + actionType + ". Use APPROVE or REJECT");
        }

        if (action.remarks() != null) {
            bookRequest.setRemarks(action.remarks());
        }

        BookRequest saved = bookRequestRepository.save(bookRequest);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BookRequestResponse> getRequestsByStudent(Long studentId, Pageable pageable) {
        Page<BookRequest> page = bookRequestRepository.findByStudentStudentId(studentId, pageable);
        return PagedResponse.from(page.map(this::mapToResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BookRequestResponse> getPendingRequests(Pageable pageable) {
        Page<BookRequest> page = bookRequestRepository.findByStatus("PENDING", pageable);
        return PagedResponse.from(page.map(this::mapToResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BookRequestResponse> getRequestsByStatus(String status, Pageable pageable) {
        Page<BookRequest> page = bookRequestRepository.findByStatus(status.toUpperCase(), pageable);
        return PagedResponse.from(page.map(this::mapToResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public BookRequestResponse getRequestById(Long requestId) {
        BookRequest bookRequest = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Book request not found with id: " + requestId));
        return mapToResponse(bookRequest);
    }

    @Override
    public BookRequestResponse cancelRequest(Long requestId, Long studentId) {
        BookRequest bookRequest = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Book request not found with id: " + requestId));

        if (!bookRequest.getStudent().getStudentId().equals(studentId)) {
            throw new IllegalStateException("You can only cancel your own requests");
        }

        if (!"PENDING".equals(bookRequest.getStatus())) {
            throw new IllegalStateException("Only pending requests can be cancelled");
        }

        bookRequest.setStatus("CANCELLED");
        BookRequest saved = bookRequestRepository.save(bookRequest);
        return mapToResponse(saved);
    }

    private BookRequestResponse mapToResponse(BookRequest br) {
        return new BookRequestResponse(
                br.getRequestId(),
                br.getStudent().getStudentId(),
                br.getStudent().getFirstName() + " " + br.getStudent().getLastName(),
                br.getStudent().getRegistrationNumber(),
                br.getBook().getBookId(),
                br.getBook().getTitle(),
                br.getBook().getIsbn(),
                br.getStatus(),
                br.getRequestDate(),
                br.getApprovedBy() != null ? br.getApprovedBy().getId() : null,
                br.getApprovedBy() != null ? br.getApprovedBy().getEmail() : null,
                br.getApprovedDate(),
                br.getRemarks(),
                br.getCreatedAt());
    }
}
