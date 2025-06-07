package com.poject.employee.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDto{
    private Long id;
    private String name;
    private String description; // Assuming description is a field in the Department entity

    // You can add other fields if necessary, depending on what you want to expose to the client.
}
