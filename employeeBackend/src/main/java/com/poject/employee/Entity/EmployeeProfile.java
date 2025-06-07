package com.poject.employee.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "employee_profile")
public class EmployeeProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    @JsonManagedReference("user-profile") // Unique managed reference for user profile
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    @JsonManagedReference("employee-profile") // Unique managed reference for department
    private Department department;

    private String jobTitle;
    private Double salary;
    private int experienceYears;
    private LocalDate joinDate;
}
