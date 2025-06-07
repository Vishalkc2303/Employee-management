package com.poject.employee.Repo;


import com.poject.employee.Entity.EmployeeProfile;
import com.poject.employee.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeMyProfileRepository extends JpaRepository<EmployeeProfile, Long> {

    EmployeeProfile findByUser_Id(Long userId);

    /*Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);*/
}
