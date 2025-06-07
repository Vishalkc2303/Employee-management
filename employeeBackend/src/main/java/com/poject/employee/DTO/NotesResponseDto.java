package com.poject.employee.DTO;

// NotesResponseDto.java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotesResponseDto {
    private Long id;
    private String description;
    private Long userId;   // ID of the user, if needed
}

