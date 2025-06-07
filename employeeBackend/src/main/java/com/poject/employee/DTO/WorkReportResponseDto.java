package com.poject.employee.DTO;

import com.poject.employee.Entity.User;
import com.poject.employee.Entity.WorkReport;
import com.poject.employee.Entity.WorkReportStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkReportResponseDto {

    private Long id; // Work report ID
    private LocalDate workDate; // Date of the work report
    private String tasksCompleted; // Completed tasks description
    private String blockers; // Blockers/issues faced
    private String remarks; // Remarks by the manager or employee
    private WorkReportStatus status; // Status of the report
    private User user; // The employee who submitted the report
    private User verifiedByUser; // The manager who verified the report
    private String fullName;

    // Static method to convert WorkReport entity to WorkReportResponseDto

    // Constructor to map from WorkReport entity
    public WorkReportResponseDto(WorkReport workReport) {
        this.id = workReport.getId();
        this.workDate = workReport.getWorkDate();
        this.tasksCompleted = workReport.getTasksCompleted();
        this.blockers = workReport.getBlockers();
        this.status = workReport.getStatus();
        this.remarks = workReport.getRemarks();
    }

}
