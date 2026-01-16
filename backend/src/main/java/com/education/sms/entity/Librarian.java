package com.education.sms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "librarians")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Librarian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "employee_id", nullable = false, unique = true)
    private String employeeId;

    private String phone;
}
