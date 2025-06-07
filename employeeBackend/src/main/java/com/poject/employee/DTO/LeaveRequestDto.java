package com.poject.employee.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequestDto {

    // Basic leave request information
    private Long id;
    private String startDate;
    private String endDate;
    private String leaveType;
    private String reason;
    private String status;
    private String remarks;

    // User-related information
    private Long userId;
    private String userFullName;
   /* private String employeeName;*/

    // Timestamps
    private LocalDateTime appliedOn;
    private LocalDateTime approvedOn;
    private String createdAt;
    private String updatedAt;
}
