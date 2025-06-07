package com.poject.employee.Controller;


import com.poject.employee.DTO.CreateUserRequest;
import com.poject.employee.Entity.Role;
import com.poject.employee.Entity.User;
import com.poject.employee.Repo.RoleRepository;
import com.poject.employee.Repo.UserRepository;
import com.poject.employee.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public User createUser(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));// You should hash this in production

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);
        System.out.println(request.getCreatedBy());
        if (request.getCreatedBy() != null) {
            User creator = userRepository.findById(request.getCreatedBy())
                    .orElseThrow(() -> new RuntimeException("Creator user not found"));
            user.setCreatedBy(creator);
        }

        return userRepository.save(user);
    }

  /*  @GetMapping("all-users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }*/

    @GetMapping("all-users")
    public List<Map<String, Object>> getAllUsersWithRoles() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("email", user.getEmail());
            map.put("role", user.getRole().getName()); // Get role name from Role entity
            map.put("active", user.isActive()); // if you have an active flag
            return map;
        }).collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @PutMapping("/employees/{empId}/toggle-status")
    public ResponseEntity<String> toggleStatus(@PathVariable Long empId) {
        try {
            Optional<User> optionalUser = userRepository.findById(empId);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = optionalUser.get();
            user.setActive(!user.isActive()); // toggle the status
            userRepository.save(user);

            return ResponseEntity.ok("User status toggled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }


}

