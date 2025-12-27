package com.education.sms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- FIX HERE TOO ---
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false) // Remove referencedColumnName="userId"
    private User user;
    // --------------------

    private String firstName;
    private String lastName;

    @Column(nullable = false)
    private String department;
    private String phone;

    private String employeeId;
}