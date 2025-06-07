package com.poject.employee.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "notes")

public class Notes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY) // Lazy loading to avoid unnecessary fetch
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
