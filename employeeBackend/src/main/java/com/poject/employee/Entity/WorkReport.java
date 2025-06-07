package com.poject.employee.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.poject.employee.DTO.WorkReportDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "work_reports")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference("user-work-report") // Unique managed reference for user in work report
    private User user; // Reference to the employee

    private LocalDate workDate; // Date for which this work report is submitted

    @Column(nullable = false, length = 1000)
    private String tasksCompleted; // Description of work done

    @Column(length = 1000)
    private String blockers; // Any issues/blockers faced

    @Column(length = 1000)
    private String remarks; // Manager or employee remarks

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkReportStatus status = WorkReportStatus.DRAFT; // Report status

    @ManyToOne
    @JoinColumn(name = "verified_by_user_id")
    private User verifiedByUser; // Reference to the manager (User entity) who verified the report

    public void update(WorkReportDto workReportDto) {
        this.workDate = workReportDto.getWorkDate();
        this.tasksCompleted = workReportDto.getTasksCompleted();
        this.blockers = workReportDto.getBlockers();
        this.status = workReportDto.getStatus();
    }

    public WorkReport(WorkReportDto dto) {
        this.workDate = dto.getWorkDate();
        this.tasksCompleted = dto.getTasksCompleted();
        this.blockers = dto.getBlockers();
        this.status = dto.getStatus();
    }
}
