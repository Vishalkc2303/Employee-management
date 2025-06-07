package com.poject.employee.Service;

import com.poject.employee.Entity.User;
import com.poject.employee.Repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> validateUser(String email, String password){
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()  && passwordEncoder.matches(password,user.get().getPassword())){
            return user;
        }
        return Optional.empty();

    }

    /*public boolean toggleEmployeeStatus(Long empId, boolean isActive) {
        Optional<User> optionalUser = userRepository.findById(empId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setActive(isActive);
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }*/
}
