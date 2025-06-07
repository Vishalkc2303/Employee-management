package com.poject.employee.Repo;

import com.poject.employee.Entity.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Long> {
    List<EmployeeProfile> findByDepartmentId(Long departmentId);
    List<EmployeeProfile> findByUserId(Long userId);
}