package com.poject.employee.Service;



import com.poject.employee.DTO.EmployeeProfileDTO;
import com.poject.employee.Entity.Department;
import com.poject.employee.Entity.EmployeeProfile;
import com.poject.employee.Entity.User;
import com.poject.employee.Repo.DepartmentRepository;
import com.poject.employee.Repo.EmployeeProfileRepository;
import com.poject.employee.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeProfileService {

    private final EmployeeProfileRepository employeeProfileRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public EmployeeProfileService(
            EmployeeProfileRepository employeeProfileRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository) {
        this.employeeProfileRepository = employeeProfileRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<EmployeeProfile> getAllEmployeeProfiles() {
        return employeeProfileRepository.findAll();
    }

    public EmployeeProfile getEmployeeProfileById(Long id) {
        return employeeProfileRepository.findById(id).orElse(null);
    }

    public List<EmployeeProfile> getEmployeeProfilesByDepartment(Long departmentId) {
        return employeeProfileRepository.findByDepartmentId(departmentId);
    }

    @Transactional
    public EmployeeProfile updateEmployeeProfile(Long id, EmployeeProfile updatedProfile) {
        EmployeeProfile existingProfile = employeeProfileRepository.findById(id).orElse(null);
        if (existingProfile == null) return null;

        // Validate User
        User user = userRepository.findById(updatedProfile.getUser().getId()).orElse(null);
        if (user == null) return null;

        // Validate Department
        Department department = departmentRepository.findById(updatedProfile.getDepartment().getId()).orElse(null);
        if (department == null) return null;

        // Set updated values
        existingProfile.setUser(user);
        existingProfile.setDepartment(department);
        existingProfile.setJobTitle(updatedProfile.getJobTitle());
        existingProfile.setSalary(updatedProfile.getSalary());
        existingProfile.setExperienceYears(updatedProfile.getExperienceYears());
        existingProfile.setJoinDate(updatedProfile.getJoinDate());

        return employeeProfileRepository.save(existingProfile);
    }

    public EmployeeProfile createEmployeeProfile(EmployeeProfileDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        EmployeeProfile profile = new EmployeeProfile();
        profile.setUser(user);
        profile.setDepartment(dept);
        profile.setJobTitle(dto.getJobTitle());
        profile.setSalary(dto.getSalary());
        profile.setExperienceYears(dto.getExperienceYears());
        /*profile.setJoinDate(dto.getJoinDate());*/

        return employeeProfileRepository.save(profile);
    }


    /*public EmployeeProfile createEmployeeProfile(EmployeeProfile employeeProfile) {
        // Fetch actual User from DB
        Long userId = employeeProfile.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Fetch actual Department from DB
        Long deptId = employeeProfile.getDepartment().getId();
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + deptId));

        // Set the full entities
        employeeProfile.setUser(user);
        employeeProfile.setDepartment(dept);

        // Now save the profile
        return employeeProfileRepository.save(employeeProfile);
    }*/

    @Transactional
    public void deleteEmployeeProfile(Long id) {
        EmployeeProfile profile = employeeProfileRepository.findById(id).orElse(null);
        if (profile != null) {
            employeeProfileRepository.delete(profile);
        }
    }
}
