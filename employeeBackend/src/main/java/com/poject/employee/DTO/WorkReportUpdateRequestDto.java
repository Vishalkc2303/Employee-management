package com.poject.employee.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkReportUpdateRequestDto {
    private String status;
    private String remarks;
    private Long verifiedByUser;
}
