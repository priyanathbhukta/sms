package com.education.sms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_entities")
@Getter
@Setter // <--- CRITICAL: Generates getGrade(), getSection(), etc.
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grade_level", nullable = false)
    private String gradeLevel;

    @Column(nullable = false)
    private String section;

    private String address;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;
}