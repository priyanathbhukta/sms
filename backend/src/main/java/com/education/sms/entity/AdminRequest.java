package com.education.sms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class AdminRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_user_id", nullable = false)
    @ToString.Exclude
    private User requesterUser;

    @Column(name = "request_type", nullable = false)
    private String requestType; // "request_status_pending" / "request_status_approved" /
                                // "request_status_rejected"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "previous_date")
    private LocalDateTime previousDate;

    @Column(name = "new_date")
    private LocalDateTime newDate;

    @Column(name = "request_document_url")
    private String requestDocumentUrl;

    @Column(nullable = false)
    @Builder.Default
    private String status = "pending"; // "pending" / "approved" / "rejected"

    @Column(name = "admin_comments", columnDefinition = "TEXT")
    private String adminComments;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
