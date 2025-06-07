package com.poject.employee.Repo;

import com.poject.employee.Entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest,Long> {
    List<LeaveRequest> findByUserId(Long userId);
    long countByStatus(String status);


}
