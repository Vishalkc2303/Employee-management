package com.poject.employee.Repo;

import com.poject.employee.Entity.Role;
import com.poject.employee.Entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(RoleName name);
}
