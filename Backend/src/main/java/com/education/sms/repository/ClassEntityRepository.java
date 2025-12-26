package com.education.sms.repository;

import com.education.sms.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassEntityRepository extends JpaRepository<ClassEntity, Long> {

    // Spring parses this as:
    // find where 'grade' = ? AND 'section' = ? AND 'year' = ?
    boolean existsByGradeAndSectionAndYear(String grade, String section, Integer year);
}