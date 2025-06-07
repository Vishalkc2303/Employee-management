package com.poject.employee.DTO;

import com.poject.employee.Entity.WorkReportStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkReportDto {

    private Long id; // ID will be used when updating a report
    private LocalDate workDate; // The date of the report (optional, can be set to today by default)
    private String tasksCompleted; // Description of work done
    private String blockers; // Any issues/blockers
    private WorkReportStatus status; // Status of the report (e.g., DRAFT, SUBMITTED, VERIFIED)
    private Long userId; // The ID of the employee (user) who created the report



    // Update method

}
