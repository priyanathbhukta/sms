package com.education.sms.repository;

import com.education.sms.entity.FeesStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeesStructureRepository extends JpaRepository<FeesStructure, Long> {

    List<FeesStructure> findByClassEntityId(Long classId);

    List<FeesStructure> findByFeeType(String feeType);

    boolean existsByClassEntityIdAndFeeType(Long classId, String feeType);
}
