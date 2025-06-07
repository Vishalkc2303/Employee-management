package com.poject.employee.Entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "employee_personal_details")
public class EmployeePersonalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id",unique = true)
    @JsonBackReference
    private User user;

    private String fullName;
    private String profilePic;
    private String phone;
    private String address;
    private String linkedinUrl;
    private String resumeUrl;
    private LocalDate dateOfBirth;

}
