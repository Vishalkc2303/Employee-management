package com.poject.employee.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@NoArgsConstructor
/*@AllArgsConstructor*/
public class EmployeeProfileDTO {
    private Long id;
    private String jobTitle;
    private Double salary;
    private int experienceYears;
    private String joinDate;

    // Department data
    private Long departmentId;
    private String departmentName;

    // User data
    private Long userId;
    private String userEmail;
    private String userRole;

    // Constructor for EmployeeProfileDTO
    public EmployeeProfileDTO(Long id, String jobTitle, Double salary, int experienceYears, String joinDate,
                              Long departmentId, String departmentName
                             ) {
        this.id = id;
        this.jobTitle = jobTitle;
        this.salary = salary;
        this.experienceYears = experienceYears;
        this.joinDate = joinDate;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        /*this.userId = userId;
        this.userEmail = userEmail;
        this.userRole = userRole;*/
    }
}

