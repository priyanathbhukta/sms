package com.education.sms.repository;

import com.education.sms.entity.Librarian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibrarianRepository extends JpaRepository<Librarian, Long> {

    Optional<Librarian> findByEmployeeId(String employeeId);

    Page<Librarian> findAll(Pageable pageable);

    Optional<Librarian> findByUserId(Long userId);

    @Query("SELECT l FROM Librarian l WHERE LOWER(l.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(l.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Librarian> searchByName(@Param("name") String name, Pageable pageable);

    @Query("SELECT COUNT(l) FROM Librarian l")
    long countAllLibrarians();
}
