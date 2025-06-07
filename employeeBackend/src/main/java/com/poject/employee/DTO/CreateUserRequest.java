package com.poject.employee.DTO;



import lombok.Data;

@Data
public class CreateUserRequest {
    private String email;
    private String password;
    private Long roleId;
    private Long createdBy;
}

