package com.education.sms.repository;

import com.education.sms.entity.BookRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {

    Page<BookRequest> findByStudentStudentId(Long studentId, Pageable pageable);

    Page<BookRequest> findByStatus(String status, Pageable pageable);

    List<BookRequest> findByStudentStudentIdAndStatus(Long studentId, String status);

    @Query("SELECT br FROM BookRequest br WHERE br.book.id = :bookId AND br.status = 'PENDING'")
    List<BookRequest> findPendingRequestsForBook(@Param("bookId") Long bookId);

    @Query("SELECT COUNT(br) FROM BookRequest br WHERE br.status = 'PENDING'")
    long countPendingRequests();

    @Query("SELECT COUNT(br) FROM BookRequest br WHERE br.student.studentId = :studentId AND br.status = 'PENDING'")
    long countPendingRequestsByStudent(@Param("studentId") Long studentId);
}
