package com.poject.employee.Repo;

import com.poject.employee.Entity.EmployeePersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeePersonalDetailsRepo extends JpaRepository<EmployeePersonalDetails,Long> {
    Optional<EmployeePersonalDetails> findByUserId(Long userId);

}
