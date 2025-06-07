package com.poject.employee.Controller;

import com.poject.employee.DTO.EmployeePersonalDetailsDto;
import com.poject.employee.Entity.EmployeePersonalDetails;
import com.poject.employee.Service.EmployeePersonalDetailsService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/personal-details")
public class EmployeePersonalDetailsController {

    private final EmployeePersonalDetailsService personalDetailsService;

    public EmployeePersonalDetailsController(EmployeePersonalDetailsService personalDetailsService) {
        this.personalDetailsService = personalDetailsService;
    }
    @GetMapping
    public EmployeePersonalDetailsDto getOwnDetails(HttpSession session) {
        // Assumes you stored userId in session attribute "userId" upon login
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("User not logged in");
        }
        return personalDetailsService.getByUserId(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeePersonalDetails createDetails(HttpSession session,
                                                 @RequestBody EmployeePersonalDetailsDto req) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("User not logged in");
        }
        return personalDetailsService.createDetailsForCurrentUser(userId, req);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public EmployeePersonalDetails updateDetails(HttpSession session,
                                                 @RequestBody EmployeePersonalDetailsDto req) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalStateException("User not logged in");
        }
        return personalDetailsService.updateDetailsForCurrentUser(userId, req);
    }

}
