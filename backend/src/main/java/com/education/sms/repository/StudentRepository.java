package com.education.sms.repository;

import com.education.sms.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Page<Student> findAll(Pageable pageable);

    Page<Student> findByClassEntityId(Long classId, Pageable pageable);

    List<Student> findByClassEntityId(Long classId);

    Optional<Student> findByUserId(Long userId);

    @Query("SELECT s FROM Student s WHERE s.user.id = :userId")
    Optional<Student> findByUserUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM Student s WHERE LOWER(s.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Student> searchByName(@Param("name") String name, Pageable pageable);

    @Query("SELECT COUNT(s) FROM Student s")
    long countAllStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.classEntity.id = :classId")
    long countByClassId(@Param("classId") Long classId);
}
