package com.poject.employee.Repo;

import com.poject.employee.Entity.WorkReport;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkReportRepository extends JpaRepository<WorkReport,Long> {



    List<WorkReport> findByUserId(Long userId, Sort sort);
    // Find work reports by a specific date
    List<WorkReport> findByWorkDate(LocalDate date);
}