package com.education.sms.repository;

import com.education.sms.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Page<Faculty> findAll(Pageable pageable);

    Optional<Faculty> findByUserId(Long userId);

    @Query("SELECT f FROM Faculty f WHERE f.user.id = :userId")
    Optional<Faculty> findByUserUserId(@Param("userId") Long userId);

    // Use Spring Data JPA derived query for safer and standard case-insensitive
    // search
    Page<Faculty> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName,
            Pageable pageable);

    @Query("SELECT f FROM Faculty f WHERE LOWER(f.department) = LOWER(:department)")
    Page<Faculty> findByDepartment(@Param("department") String department, Pageable pageable);

    @Query("SELECT COUNT(f) FROM Faculty f")
    long countAllFaculty();
}
