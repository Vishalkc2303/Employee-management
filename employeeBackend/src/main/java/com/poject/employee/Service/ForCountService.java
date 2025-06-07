package com.poject.employee.Service;


import com.poject.employee.Repo.LeaveRequestRepository;
import com.poject.employee.Repo.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ForCountService {

    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    // Constructor Injection
    public ForCountService(UserRepository userRepository, LeaveRequestRepository leaveRequestRepository) {
        this.userRepository = userRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public long getTotalEmployeeCount() {
        return userRepository.count();
    }

    public long getPendingLeaveRequestCount() {
        return leaveRequestRepository.countByStatus("PENDING");
    }
}
