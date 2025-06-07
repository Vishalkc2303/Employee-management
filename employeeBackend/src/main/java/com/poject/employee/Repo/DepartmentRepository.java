// 2. Repository - DepartmentRepository.java
package com.poject.employee.Repo;

import com.poject.employee.Entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // Custom query methods
    Optional<Department> findByName(String name);
    boolean existsByName(String name);
}