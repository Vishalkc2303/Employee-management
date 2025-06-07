package com.poject.employee.Controller;

import com.poject.employee.DTO.EmployeeProfileDTO;
import com.poject.employee.Entity.EmployeeProfile;
import com.poject.employee.Entity.User;
import com.poject.employee.Service.EmployeeMyProfileService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class EmployeeMyProfileController {

    private final EmployeeMyProfileService profileService;

    @Autowired
    public EmployeeMyProfileController(EmployeeMyProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getProfile() {
        User user = profileService.getCurrentUserProfile();

        // Return only non-sensitive data
        return ResponseEntity.ok(Map.of("email", user.getEmail()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordRequest) {
        String newPassword = passwordRequest.get("newPassword");

        try {
            profileService.changePassword(newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error changing password");
        }
    }

   /* @GetMapping("/employee-details")
    public ResponseEntity<EmployeeProfile> getEmployeeProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        EmployeeMyProfileService profile = profileService.getProfileByUserId(userId);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile);
    }*/
    @GetMapping("/employee-details")
    public ResponseEntity<EmployeeProfileDTO> getEmployeeProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        // Call the service to get the EmployeeProfile (not the service class itself)
        EmployeeProfileDTO profileDTO = profileService.getProfileByUserId(userId);


        if (profileDTO == null) {
            return ResponseEntity.notFound().build(); // If profile not found
        }


        return ResponseEntity.ok(profileDTO); // Return the profile as response
    }

   /* @GetMapping("/employee-details")
    public ResponseEntity<EmployeeProfile> getEmployeeProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        EmployeeProfile profile = profileService.getProfileByUserId(userId);
        System.out.println("dfadfsdfds" + profile);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile); // Will now include department & user info
    }*/


    /*@GetMapping
    public ResponseEntity<Map<String, String>> getProfile() {
        User user = profileService.getCurrentUserProfile();

        // Send only non-sensitive fields like email
        return ResponseEntity.ok(Map.of("email", user.getEmail()));
    }*/

    /*@PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordRequest) {
        String currentPassword = passwordRequest.get("currentPassword");
        String newPassword = passwordRequest.get("newPassword");

        try {
            profileService.changePassword(currentPassword, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error changing password");
        }
    }*/
}
