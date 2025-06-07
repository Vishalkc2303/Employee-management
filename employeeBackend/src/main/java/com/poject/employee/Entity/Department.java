package com.poject.employee.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;


/*
    @JsonManagedReference("dept-emp") // Add a name to the reference
*/
    @OneToMany(mappedBy = "department")
    @JsonBackReference("employee-profile")
    private List<EmployeeProfile> employees;
}