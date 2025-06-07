package com.poject.employee.Service;


import com.poject.employee.DTO.EmployeeProfileDTO;
import com.poject.employee.Entity.Department;
import com.poject.employee.Entity.EmployeeProfile;
import com.poject.employee.Entity.User;

import com.poject.employee.Repo.EmployeeMyProfileRepository;
import com.poject.employee.Repo.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class EmployeeMyProfileService {

    private final EmployeeMyProfileRepository myprofileRepo;

    @Autowired
    private UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public EmployeeMyProfileService(EmployeeMyProfileRepository myprofileRepo, PasswordEncoder passwordEncoder) {
        this.myprofileRepo = myprofileRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User getCurrentUserProfile() {
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest().getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            throw new RuntimeException("User session not found");
        }

        Long userId = (Long) session.getAttribute("userId");

        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    /*public User getCurrentUserProfile() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return myprofileRepo.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }*/

    public void changePassword(String newPassword) {
        // Get user ID from the session (assuming you’ve set it in the session attributes)
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest().getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            throw new RuntimeException("User session not found");
        }

        Long userId = (Long) session.getAttribute("userId");

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }


    /*public void changePassword(String currentPassword, String newPassword) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        User user = myprofileRepo.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        myprofileRepo.save(user);
    }*/

    public EmployeeProfileDTO getProfileByUserId(Long userId) {
        EmployeeProfile profile = myprofileRepo.findByUser_Id(userId);

        if (profile != null) {
            Department department = profile.getDepartment();
            User user = profile.getUser();

            // Convert to DTO
            return new EmployeeProfileDTO(
                    profile.getId(),
                    profile.getJobTitle(),
                    profile.getSalary(),
                    profile.getExperienceYears(),
                    profile.getJoinDate().toString(), // Or format the date accordingly
                    department != null ? department.getId() : null,
                    department != null ? department.getName() : null
                    /*user != null ? user.getId() : null,
                    user != null ? user.getEmail() : null,
                    user != null ? String.valueOf(user.getRole().getName()) : null*/
            );
        }
        return null;
    }

   /* public EmployeeProfile getProfileByUserId(Long userId) {
        return myprofileRepo.findByUser_Id(userId);
    }*/
}
