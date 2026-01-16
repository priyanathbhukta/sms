package com.education.sms.repository;

import com.education.sms.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByStudentStudentId(Long studentId);

    List<Result> findByExamExamId(Long examId);

    Optional<Result> findByExamExamIdAndStudentStudentId(Long examId, Long studentId);

    List<Result> findByStudentStudentIdAndIsFinalized(Long studentId, Boolean isFinalized);
}
