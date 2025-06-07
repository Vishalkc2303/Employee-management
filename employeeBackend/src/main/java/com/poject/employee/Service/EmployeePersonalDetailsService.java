package com.poject.employee.Service;


import com.poject.employee.DTO.EmployeePersonalDetailsDto;
import com.poject.employee.Entity.EmployeePersonalDetails;
import com.poject.employee.Entity.User;
import com.poject.employee.Repo.EmployeePersonalDetailsRepo;
import com.poject.employee.Repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class EmployeePersonalDetailsService {

    private final EmployeePersonalDetailsRepo personalDetailsRepo;
    private final UserRepository userRepo;

    public EmployeePersonalDetailsService(EmployeePersonalDetailsRepo personalDetailsRepo,UserRepository userRepo) {
        this.personalDetailsRepo = personalDetailsRepo;
        this.userRepo = userRepo;
    }

    public EmployeePersonalDetailsDto getByUserId(Long userId) {
        EmployeePersonalDetails details = personalDetailsRepo
                .findByUserId(userId)
                .orElse(null);

        if (details == null) {
            return null;
        }
        // Map entity → DTO
        EmployeePersonalDetailsDto dto = new EmployeePersonalDetailsDto();
        dto.setFullName(details.getFullName());
        dto.setPhone(details.getPhone());
        dto.setAddress(details.getAddress());
        dto.setLinkedinUrl(details.getLinkedinUrl());
        dto.setResumeUrl(details.getResumeUrl());
        dto.setProfilePic(details.getProfilePic());
        dto.setDateOfBirth(details.getDateOfBirth());
        return dto;
    }

    @Transactional
    public EmployeePersonalDetails createDetailsForCurrentUser(Long userId, EmployeePersonalDetailsDto req) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + userId));

        // Prevent duplicate entries
        if (personalDetailsRepo.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Details already exist for user " + userId);
        }

        EmployeePersonalDetails details = new EmployeePersonalDetails();
        details.setUser(user);

        if (req.getFullName()      != null) details.setFullName(req.getFullName());
        if (req.getPhone()         != null) details.setPhone(req.getPhone());
        if (req.getAddress()       != null) details.setAddress(req.getAddress());
        if (req.getLinkedinUrl()   != null) details.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getResumeUrl()     != null) details.setResumeUrl(req.getResumeUrl());
        if (req.getProfilePic() != null) details.setProfilePic(req.getProfilePic());
        if (req.getDateOfBirth()   != null) details.setDateOfBirth(req.getDateOfBirth());

        return personalDetailsRepo.save(details);
    }

    public EmployeePersonalDetails updateDetailsForCurrentUser(Long userId, EmployeePersonalDetailsDto dto) {
        EmployeePersonalDetails existing = personalDetailsRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Details not found"));

        existing.setFullName(dto.getFullName());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());
        existing.setLinkedinUrl(dto.getLinkedinUrl());
        existing.setResumeUrl(dto.getResumeUrl());
        // add more fields as necessary

        return personalDetailsRepo.save(existing);
    }

}
