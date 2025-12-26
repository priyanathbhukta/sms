package com.education.sms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_entities")
@Getter
@Setter// <--- CRITICAL: Generates getGrade(), getSection(), etc.
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The Repository looks for this exact name "grade"
    @Column(nullable = false)
    private String grade;

    @Column(nullable = false)
    private String section;

    @Column(nullable = false)
    private Integer year;
}