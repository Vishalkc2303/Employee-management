package com.poject.employee.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The employee requesting leave
    @ManyToOne(optional = false, fetch = FetchType.EAGER)

    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    // Leave period
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    // Type and reason
    @Column(name = "leave_type", length = 50, nullable = false)
    private String leaveType;

    @Column(name = "reason", length = 500)
    private String reason;

    // Approval workflow
    @Column(name = "status", length = 20, nullable = false)
    private String status; // e.g. "PENDING", "APPROVED", "REJECTED"

    @Column(name = "applied_on", nullable = false, updatable = false)
    private LocalDateTime appliedOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_on")
    private LocalDateTime approvedOn;

    @Column(name = "remarks", length = 500)
    private String remarks;

    // Auditing
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.appliedOn = now;
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
