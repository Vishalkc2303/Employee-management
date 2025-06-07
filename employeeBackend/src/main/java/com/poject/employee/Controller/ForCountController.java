package com.poject.employee.Controller;


import com.poject.employee.Service.ForCountService;
import com.poject.employee.Service.LeaveRequestService;
import com.poject.employee.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/counts") // You can adjust the base path if you want
public class ForCountController {

    private final ForCountService forCountService;


    // Constructor Injection
    public ForCountController(ForCountService forCountService) {
        this.forCountService = forCountService;
    }

    @GetMapping("/employees")
    public ResponseEntity<Map<String, Long>> getTotalEmployees() {
        long count = forCountService.getTotalEmployeeCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/leaves/pending")
    public ResponseEntity<Map<String, Long>> getPendingLeaves() {
        long count = forCountService.getPendingLeaveRequestCount();
        return ResponseEntity.ok(Map.of("count", count));
    }
}
