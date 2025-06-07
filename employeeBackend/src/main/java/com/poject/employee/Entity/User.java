package com.poject.employee.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonIgnore
    private User createdBy;

    @Column(name = "is_active")
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @JsonBackReference("user-profile")
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private EmployeeProfile employeeProfile;

    @JsonManagedReference("user-personal-details")
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private EmployeePersonalDetails personalDetails;

    @OneToMany(mappedBy = "user")
    @JsonManagedReference("user-leave-requests")
    private List<LeaveRequest> leaveRequests;

    @OneToMany(mappedBy = "user")
    @JsonBackReference("user-work-reports")
    private List<WorkReport> workReports;
}
