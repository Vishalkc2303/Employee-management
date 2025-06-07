package com.poject.employee.Service;

import com.poject.employee.DTO.WorkReportDto;
import com.poject.employee.DTO.WorkReportResponseDto;
import com.poject.employee.DTO.WorkReportUpdateRequestDto;
import com.poject.employee.Entity.User;
import com.poject.employee.Entity.WorkReport;
import com.poject.employee.Entity.WorkReportStatus;
import com.poject.employee.Repo.UserRepository;
import com.poject.employee.Repo.WorkReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkReportService {

    @Autowired
    private WorkReportRepository workReportRepository;

    @Autowired
    private UserRepository userRepository;

    // Service method to create a new report
    // Service method to create a new report
    public WorkReport createWorkReport(WorkReportDto workReportDto, Long userId) {
        // Retrieve the user based on the userId from the session
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create the WorkReport and set the user and other fields
        WorkReport workReport = new WorkReport();
        workReport.setUser(user); // Set the user object
        workReport.setWorkDate(workReportDto.getWorkDate());
        workReport.setTasksCompleted(workReportDto.getTasksCompleted());
        workReport.setBlockers(workReportDto.getBlockers());
        workReport.setStatus(workReportDto.getStatus()); // Default status as provided in the DTO

        // Save the WorkReport
        return workReportRepository.save(workReport);
    }


    // Service method to update an existing report
    public WorkReportResponseDto updateWorkReport(WorkReportDto workReportDto) {
        // Check if the report exists
        Optional<WorkReport> existingReport = workReportRepository.findById(workReportDto.getId());

        if (existingReport.isPresent()) {
            WorkReport workReport = existingReport.get();
            // Update the fields of the existing report
            workReport.update(workReportDto);

            // Save the updated report back to the repository
            workReport = workReportRepository.save(workReport);

            // Return the updated report as a response DTO
            return new WorkReportResponseDto(workReport);
        }

        // If report does not exist, return null (or an appropriate response)
        return null;
    }



    // Create or update a work report
    /*public WorkReportResponseDto saveOrUpdateWorkReport(WorkReportDto workReportDto) {
        // Convert DTO to entity
        WorkReport workReport = new WorkReport();
        workReport.setId(workReportDto.getId());
        workReport.setWorkDate(workReportDto.getWorkDate() == null ? LocalDate.now() : workReportDto.getWorkDate());
        workReport.setTasksCompleted(workReportDto.getTasksCompleted());
        workReport.setBlockers(workReportDto.getBlockers());
        workReport.setStatus(workReportDto.getStatus());

        // Save to the repository
        WorkReport savedWorkReport = workReportRepository.save(workReport);

        // Convert entity back to DTO
        return mapToResponseDTO(savedWorkReport);
    }*/

    // Get a work report by ID
    // Fetch work reports by userId (from session)
    public List<WorkReportResponseDto> getWorkReportsByUserId(Long userId) {
        List<WorkReport> workReports = workReportRepository.findByUserId(userId, Sort.by(Sort.Order.desc("workDate")));
        return workReports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Fetch all work reports (no user filter)
    public List<WorkReportResponseDto> getUSerAllWorkReports() {
        // Fetch all work reports sorted by 'workDate' in descending order
        List<WorkReport> workReports = workReportRepository.findAll(Sort.by(Sort.Order.desc("workDate")));

        return workReports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    public List<WorkReportResponseDto> getAllWorkReports() {
        List<WorkReport> workReports = workReportRepository.findAll(Sort.by(Sort.Order.desc("workDate")));
        List<WorkReportResponseDto> responseDtoList = new ArrayList<>();

        for (WorkReport workReport : workReports) {
            WorkReportResponseDto dto = new WorkReportResponseDto();
            dto.setId(workReport.getId());
            dto.setTasksCompleted(workReport.getTasksCompleted());
            dto.setStatus(workReport.getStatus());
            dto.setWorkDate(workReport.getWorkDate());
            dto.setBlockers(workReport.getBlockers()); // Blockers field

            // Fetching the full name of the user
            User user = workReport.getUser(); // Assuming the 'user' object is already populated in WorkReport
            if (user != null) {
                dto.setFullName(user.getPersonalDetails().getFullName()); // Concatenating first and last name
            }

            // Adding the report to the response list
            responseDtoList.add(dto);
        }

        return responseDtoList;
    }

    public List<WorkReportResponseDto> getWorkReportsByDate(LocalDate date) {
        List<WorkReport> workReports = workReportRepository.findByWorkDate(date);
        return workReports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Delete a work report by ID
    public boolean deleteWorkReport(Long id) {
        if (workReportRepository.existsById(id)) {
            workReportRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public WorkReport updateWorkReport(Long reportId, WorkReportUpdateRequestDto updateRequest, Long userId) {
        // Fetch the existing report
        WorkReport report = workReportRepository.findById(reportId)
                .orElseThrow(() -> new NoSuchElementException("WorkReport not found"));


        // (Optional) Verify that the user is allowed to update this report
        // For example, you can check if (report.getCreatedBy().equals(userId)) or any other ownership rule

        // Update fields safely
        if (updateRequest.getStatus() != null) {
            report.setStatus(WorkReportStatus.valueOf(updateRequest.getStatus()));
        }

        if (updateRequest.getRemarks() != null) {
            report.setRemarks(updateRequest.getRemarks());
        }
        updateRequest.setVerifiedByUser(userId);

        // Set other fields if needed in future...

        // Save the updated report
        return workReportRepository.save(report);
    }
   /* public WorkReport updateWorkReport(Long reportId, WorkReportResponseDto updateRequest, Long userId) {
        Optional<WorkReport> optionalWorkReport = workReportRepository.findById(reportId);

        if (optionalWorkReport.isEmpty()) {
            // Return null or handle it differently
            return null;  // Optionally return an empty Optional<WorkReport>
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkReport workReport = optionalWorkReport.get();
        workReport.setStatus(updateRequest.getStatus());
        workReport.setRemarks(updateRequest.getRemarks());
        workReport.setVerifiedByUser(user); // Setting the userId who verified

        // Save the updated report back to the database
        return workReportRepository.save(workReport);
    }*/


    // Convert the WorkReport entity to a response DTO
    public WorkReportResponseDto mapToResponse2DTO(WorkReport workReport) {
        WorkReportResponseDto dto = new WorkReportResponseDto();
        dto.setId(workReport.getId());
        dto.setStatus(workReport.getStatus());
        dto.setRemarks(workReport.getRemarks());
        dto.setVerifiedByUser(workReport.getVerifiedByUser());  // Assuming this is the user ID
        return dto;
    }

    // Convert entity to response DTO
    private WorkReportResponseDto mapToResponseDTO(WorkReport workReport) {
        WorkReportResponseDto workReportResponseDto = new WorkReportResponseDto();
/*
        workReportResponseDto.setId(workReport.getId());
*/
        workReportResponseDto.setWorkDate(workReport.getWorkDate());
        workReportResponseDto.setTasksCompleted(workReport.getTasksCompleted());
        workReportResponseDto.setBlockers(workReport.getBlockers());
        workReportResponseDto.setRemarks(workReport.getRemarks()); // Assuming remarks are part of response DTO
        workReportResponseDto.setStatus(workReport.getStatus());
        return workReportResponseDto;
    }
}
