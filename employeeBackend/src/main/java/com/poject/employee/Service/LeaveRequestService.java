package com.poject.employee.Service;


import com.poject.employee.DTO.LeaveRequestDto;
import com.poject.employee.Entity.LeaveRequest;
import com.poject.employee.Entity.User;
import com.poject.employee.Repo.LeaveRequestRepository;
import com.poject.employee.Repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {
    private final LeaveRequestRepository leaveRepo;
    private final UserRepository userRepo;

    public LeaveRequestService(LeaveRequestRepository leaveRepo,
                               UserRepository userRepo) {
        this.leaveRepo = leaveRepo;
        this.userRepo  = userRepo;
    }

    public void createLeaveRequest(Long userId, LeaveRequestDto dto) {
        LeaveRequest entity = new LeaveRequest();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            LocalDate start = LocalDate.parse(dto.getStartDate());
            LocalDate end = LocalDate.parse(dto.getEndDate());

            entity.setUser(user);
            entity.setStartDate(start);
            entity.setEndDate(end);
            entity.setLeaveType(dto.getLeaveType());
            entity.setReason(dto.getReason());
            entity.setStatus("PENDING");

            leaveRepo.save(entity);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Please use YYYY-MM-DD.", e);
        }
    }

    /*@Transactional
    public LeaveRequest createLeaveRequest(Long userId, LeaveRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + userId));

        request.setUser(user);
        request.setStatus("PENDING");
        // appliedOn, createdAt, updatedAt set automatically by @PrePersist
        return leaveRepo.save(request);
    }*/

  /*  @Transactional(readOnly = true)*/
    /*public List<LeaveRequest> getRequestsForUser(Long userId) {
        return leaveRepo.findByUserId(userId);
    }*/
 /* public List<LeaveRequestDto> getRequestsForUser(Long userId) {
      LeaveRequest leaveRequest = leaveRepo.findById(userId).orElseThrow();
      LeaveRequestDto dto = new LeaveRequestDto();
      dto.setId(leaveRequest.getId());
      dto.setReason(leaveRequest.getReason());
      dto.setStartDate(String.valueOf(leaveRequest.getStartDate()));
      dto.setEndDate(String.valueOf(leaveRequest.getEndDate()));
      dto.setUserFullName(leaveRequest.getUser().getPersonalDetails().getFullName()); // manually access
      return ResponseEntity.ok(dto);

  }*/

   /* public List<LeaveRequestDto> getRequestsForUser(Long userId) {
        List<LeaveRequest> leaveRequests = leaveRepo.findByUserId(userId);
        List<LeaveRequestDto> dtoList = new ArrayList<>();
        for (LeaveRequest leaveRequest : leaveRequests) {
            LeaveRequestDto dto = new LeaveRequestDto();
            dto.setId(leaveRequest.getId());
            dto.setReason(leaveRequest.getReason());
            dto.setStartDate(leaveRequest.getStartDate().toString());
            dto.setEndDate(leaveRequest.getEndDate().toString());
            dto.setUserFullName(leaveRequest.getUser().getPersonalDetails().getFullName());

            dtoList.add(dto);
        }
        return dtoList;
    }*/

    public List<LeaveRequestDto> getRequestsForUser(Long userId) {
        // Fetch all leave requests for the user
        List<LeaveRequest> leaveRequests = leaveRepo.findByUserId(userId);

        List<LeaveRequestDto> dtoList = new ArrayList<>();

        // Loop through the leave requests and convert them into DTOs
        for (LeaveRequest leaveRequest : leaveRequests) {
            LeaveRequestDto dto = new LeaveRequestDto();

            // Basic fields
            dto.setId(leaveRequest.getId());
            dto.setReason(leaveRequest.getReason());
            dto.setStartDate(leaveRequest.getStartDate().toString()); // You can keep as LocalDate if needed
            dto.setEndDate(leaveRequest.getEndDate().toString());
            dto.setUserFullName(leaveRequest.getUser().getPersonalDetails().getFullName());

            // Additional fields
            dto.setLeaveType(leaveRequest.getLeaveType()); // Assuming LeaveRequest has a leaveType field
            dto.setStatus(leaveRequest.getStatus()); // Assuming LeaveRequest has a status field
            dto.setAppliedOn(leaveRequest.getAppliedOn() != null ? LocalDateTime.parse(leaveRequest.getAppliedOn().toString()) : null); // Handle null safely
            dto.setApprovedOn(leaveRequest.getApprovedOn() != null ? LocalDateTime.parse(leaveRequest.getApprovedOn().toString()) : null);
            dto.setCreatedAt(leaveRequest.getCreatedAt() != null ? leaveRequest.getCreatedAt().toString() : null);
            dto.setUpdatedAt(leaveRequest.getUpdatedAt() != null ? leaveRequest.getUpdatedAt().toString() : null);

            // Add DTO to list
            dtoList.add(dto);
        }

        return dtoList;
    }


    @Transactional
    public LeaveRequest updateRequestStatus(Long requestId,
                                            String newStatus,
                                            Long approverId,
                                            String remarks) {
        LeaveRequest req = leaveRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid request ID: " + requestId));

        User approver = userRepo.findById(approverId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid approver ID: " + approverId));

        req.setStatus(newStatus);
        req.setApprovedBy(approver);
        req.setRemarks(remarks);
        // approvedOn and updatedAt handled by JPA lifecycle
        return leaveRepo.save(req);
    }

    public LeaveRequest approveLeaveRequest(Long leaveRequestId, Long userId) {
        LeaveRequest leaveRequest = leaveRepo.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("LeaveRequest not found"));

        // Get the user who is approving the request
        User approver = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        // Update the status and approval details
        leaveRequest.setStatus("APPROVED");
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApprovedOn(LocalDateTime.now());

        return leaveRepo.save(leaveRequest);
    }

    // Reject a leave request
    public LeaveRequest rejectLeaveRequest(Long leaveRequestId, Long userId) {
        LeaveRequest leaveRequest = leaveRepo.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("LeaveRequest not found"));

        // Get the user who is rejecting the request
        User approver = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        // Update the status and rejection details
        leaveRequest.setStatus("REJECTED");
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApprovedOn(LocalDateTime.now());

        return leaveRepo.save(leaveRequest);
    }

    public List<LeaveRequestDto> getAllLeaveRequestDTOs() {
        List<LeaveRequest> leaveRequests = leaveRepo.findAll();

        return leaveRequests.stream().map(entity -> new LeaveRequestDto(
                entity.getId(),
                entity.getStartDate().toString(),
                entity.getEndDate().toString(),
                entity.getLeaveType(),
                entity.getReason(),
                entity.getStatus(),
                entity.getRemarks(),
                entity.getUser().getId(),
                entity.getUser().getPersonalDetails().getFullName(),

                entity.getAppliedOn(),
                entity.getApprovedOn(),
                entity.getCreatedAt().toString(),
                entity.getUpdatedAt().toString()
        )).collect(Collectors.toList());
    }

    /*public List<LeaveRequest> getAllLeaveRequests() {
        // Fetch all leave requests from the repository and return them directly
        return (List<LeaveRequest>) leaveRepo.findAll();
    }*/

    // Get all leave requests (optional filtering can be added later)
    /*public List<LeaveRequestDto> getAllLeaveRequests() {
        Iterable<LeaveRequest> leaveRequests = leaveRepo.findAll();
        List<LeaveRequestDto> leaveRequestDtos = new ArrayList<>();

        for (LeaveRequest leaveRequest : leaveRequests) {
            // Manually mapping the entity fields to DTO fields
            LeaveRequestDto dto = new LeaveRequestDto(
                    leaveRequest.getId() != null ? leaveRequest.getId().toString() : null,  // Convert Long to String
                    leaveRequest.getStartDate() != null ? leaveRequest.getStartDate().toString() : "",
                    leaveRequest.getEndDate() != null ? leaveRequest.getEndDate().toString() : "",
                    leaveRequest.getLeaveType(),
                    leaveRequest.getReason(), // Assuming reason is a String, if not convert
                    leaveRequest.getStatus(),
                    leaveRequest.getRemarks(),
                    leaveRequest.getUser() != null ? leaveRequest.getUser().getId() : null,
                    leaveRequest.getUser() != null ? leaveRequest.getUser().getPersonalDetails().getFullName() : "Unknown",
                    leaveRequest.getAppliedOn(),
                    leaveRequest.getApprovedOn(),
                    leaveRequest.getCreatedAt() != null ? leaveRequest.getCreatedAt().toString() : "",
                    leaveRequest.getUpdatedAt() != null ? leaveRequest.getUpdatedAt().toString() : ""
            );

            leaveRequestDtos.add(dto);
        }

        return leaveRequestDtos;
    }*/


}
