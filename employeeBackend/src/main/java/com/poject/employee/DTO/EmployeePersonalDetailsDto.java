package com.poject.employee.DTO;

import lombok.Data;

import java.time.LocalDate;


@Data
public class EmployeePersonalDetailsDto {

    private String fullName;
    private String phone;
    private String address;
    private String linkedinUrl;
    private String resumeUrl;
    private String profilePic;
    private LocalDate dateOfBirth;
}
