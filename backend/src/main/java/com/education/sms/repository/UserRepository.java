package com.education.sms.repository;

import com.education.sms.entity.User;
import com.education.sms.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPersonalEmail(String personalEmail);

    boolean existsByEmail(String email);

    boolean existsByRole(UserRole role);
}
