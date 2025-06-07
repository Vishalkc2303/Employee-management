package com.poject.employee.Controller;


import com.poject.employee.DTO.LeaveRequestDto;
import com.poject.employee.Entity.LeaveRequest;
import com.poject.employee.Service.LeaveRequestService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {
    private final LeaveRequestService service;

    public LeaveRequestController(LeaveRequestService service) {
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<String> submitLeaveRequest(@RequestBody LeaveRequestDto dto, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        try {
            service.createLeaveRequest(userId, dto);
            return ResponseEntity.ok("Leave request submitted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    /** Create a new leave request **/
    /*@PostMapping(consumes = "application/json", produces = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveRequest createRequest(@RequestBody LeaveRequest request,
                                      HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("User not logged in");
        }
        return service.createLeaveRequest(userId, request);
    }*/

    /** Get all leave requests for the current user **/
    @GetMapping
    public List<LeaveRequestDto> listRequests(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("User not logged in");
        }
        return service.getRequestsForUser(userId);
    }

    /** Approve or reject a leave request **/
    @PutMapping("/{id}/status")
    public LeaveRequest changeStatus(@PathVariable("id") Long requestId,
                                     @RequestBody Map<String, String> body,
                                     HttpSession session) {
        Long approverId = (Long) session.getAttribute("userId");
        if (approverId == null) {
            throw new IllegalStateException("User not logged in");
        }

        String newStatus = body.get("status");    // e.g. "APPROVED" or "REJECTED"
        String remarks   = body.get("remarks");   // optional

        return service.updateRequestStatus(requestId, newStatus, approverId, remarks);
    }

    /*@GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(service.getAllLeaveRequests());
    }
*/

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequestDto>> getAllLeaveRequests() {
        return ResponseEntity.ok(service.getAllLeaveRequestDTOs());
    }


    /*@Transactional
    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(service.getAllLeaveRequests());
    }*/



    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveLeaveRequest(@PathVariable Long id, HttpSession session) {
        // Get the userId from the session
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in.");
        }

        // Call the service method to approve the leave request
        LeaveRequest updatedRequest = service.approveLeaveRequest(id, userId);

        if (updatedRequest != null) {
            return ResponseEntity.ok("Leave request approved.");
        } else {
            return ResponseEntity.status(404).body("Leave request not found.");
        }
    }
    // Approve a leave request
   /* @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveLeaveRequest(@PathVariable Long id, @RequestParam Long userId) {
        LeaveRequest updatedRequest = service.approveLeaveRequest(id, userId);
        return ResponseEntity.ok("Leave request approved.");
    }*/

    // Reject a leave request
    /*@PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectLeaveRequest(@PathVariable Long id, @RequestParam Long userId) {
        LeaveRequest updatedRequest = service.rejectLeaveRequest(id, userId);
        return ResponseEntity.ok("Leave request rejected.");
    }*/

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectLeaveRequest(@PathVariable Long id, HttpSession session) {
        // Get the userId from the session
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in.");
        }

        // Call the service method to approve the leave request
        LeaveRequest updatedRequest = service.rejectLeaveRequest(id, userId);

        if (updatedRequest != null) {
            return ResponseEntity.ok("Leave request approved.");
        } else {
            return ResponseEntity.status(404).body("Leave request not found.");
        }
    }


}
