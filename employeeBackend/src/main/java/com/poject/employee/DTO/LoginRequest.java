package com.poject.employee.DTO;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data

public class LoginRequest {
    private String email;
    private String password;
}
