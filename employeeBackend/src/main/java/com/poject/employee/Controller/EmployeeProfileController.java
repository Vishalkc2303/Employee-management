package com.poject.employee.Controller;

import com.poject.employee.DTO.EmployeeProfileDTO;
import com.poject.employee.Entity.EmployeeProfile;
import com.poject.employee.Service.EmployeeProfileService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/employee-profiles")
public class EmployeeProfileController {



    private final EmployeeProfileService employeeProfileService;

    @Autowired
    public EmployeeProfileController(EmployeeProfileService employeeProfileService) {
        this.employeeProfileService = employeeProfileService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeProfile>> getAllEmployeeProfiles() {
        List<EmployeeProfile> profiles = employeeProfileService.getAllEmployeeProfiles();
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeProfile> getEmployeeProfileById(@PathVariable Long id) {
        EmployeeProfile profile = employeeProfileService.getEmployeeProfileById(id);
        if (profile == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeProfile>> getEmployeeProfilesByDepartment(
            @PathVariable Long departmentId) {
        List<EmployeeProfile> profiles = employeeProfileService.getEmployeeProfilesByDepartment(departmentId);
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<EmployeeProfile> createEmployeeProfile(@RequestBody EmployeeProfileDTO dto) {
        System.out.println("sdfsdfsdfsdfsdf" + dto);
        EmployeeProfile newProfile = employeeProfileService.createEmployeeProfile(dto);
        return new ResponseEntity<>(newProfile, HttpStatus.CREATED);
    }


    /*@PostMapping
    public ResponseEntity<EmployeeProfile> createEmployeeProfile(
            @RequestBody EmployeeProfile profileDetails) {

        System.out.println("Received payload: " + profileDetails);
        System.out.println("User: " + profileDetails.getUser());
        System.out.println("Department: " + profileDetails.getDepartment());
        EmployeeProfile newProfile = employeeProfileService.createEmployeeProfile(profileDetails);
        System.out.println(newProfile);
        if (newProfile == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(newProfile, HttpStatus.CREATED);
    }*/

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeProfile> updateEmployeeProfile(
            @PathVariable Long id,
            @RequestBody EmployeeProfile profileDetails) {
        EmployeeProfile updatedProfile = employeeProfileService.updateEmployeeProfile(id, profileDetails);
        if (updatedProfile == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeProfile(@PathVariable Long id) {
        employeeProfileService.deleteEmployeeProfile(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
