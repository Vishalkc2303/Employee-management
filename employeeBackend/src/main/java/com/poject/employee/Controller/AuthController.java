package com.poject.employee.Controller;


import com.poject.employee.DTO.LoginRequest;
import com.poject.employee.Entity.User;
import com.poject.employee.Repo.UserRepository;
import com.poject.employee.Service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

public class AuthController {
    private final UserService userService;


    /*@Autowired
    private UserRepository userRepository;*/

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;



    public AuthController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        // 1) find user by email only
        Optional<User> maybeUser = userRepository.findByEmail(request.getEmail());
        if (maybeUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid Email"));
        }
        User user = maybeUser.get();

        // 2) check active status first
        if (!user.isActive()) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Your account is blocked."));
        }

        // 3) now verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid password"));
        }

        // 4) success!
        session.setAttribute("userId", user.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message",   "Login successful!");
        response.put("sessionId", session.getId());
        response.put("Id",        String.valueOf(user.getId()));
        response.put("role",      user.getRole().getName().toString());
        return ResponseEntity.ok(response);
    }


   /* @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        Optional<User> foundUser = userService.validateUser(
                request.getEmail(),
                request.getPassword()
        );

        if (foundUser.isPresent()) {
            User user = foundUser.get();

            // Check account status
            if (!user.isActive()) {
                // 403 Forbidden
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Your account is blocked."));
            }

            // If active, continue as before
            session.setAttribute("userId", user.getId());

            Map<String, String> response = new HashMap<>();
            response.put("message",   "Login successful!");
            response.put("sessionId", session.getId());
            response.put("Id",        String.valueOf(user.getId()));
            response.put("role",      user.getRole().getName().toString());

            return ResponseEntity.ok(response);
        }

        // Invalid credentials
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
    }*/


    /*@PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request, HttpSession session) {
        Optional<User> foundUser = userService.validateUser(request.getEmail(), request.getPassword());

        if (foundUser.isPresent()) {
            session.setAttribute("user", foundUser.get());
            session.setAttribute("userId", foundUser.get().getId());

            String sessionId = session.getId();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("sessionId", sessionId);
            response.put("Id", String.valueOf(foundUser.get().getId()));
            response.put("role", foundUser.get().getRole().getName().toString());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }*/

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No active session"));
        }

        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok().body(Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole().getName()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found")));
    }

    @GetMapping("/myname")
    public ResponseEntity<String> getMyName(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("No active session");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Assuming User has getPersonalDetails() and that has getFullName()
        String fullName = user.getPersonalDetails().getFullName();

        return ResponseEntity.ok(fullName);
    }




    /*@PostMapping("/login")
    public ResponseEntity<Map<String ,String>> login(@RequestBody User user, HttpSession session){
        Optional<User> foundUser = userService.validateUser(user.getEmail(),user.getPassword());

        if(foundUser.isPresent()){
            session.setAttribute("user",foundUser.get());

            String sessionId = session.getId();

            Map<String,String> response = new HashMap<>();
            response.put("message","Login successful!");
            response.put("sessionId",sessionId);

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("message","Invalid credentials"));
    }*/

    @GetMapping("/validation")
    public ResponseEntity<?> getLoggedInUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String,String>> logout(HttpSession session){
        session.invalidate();
        Map<String,String> response = new HashMap<>();
        response.put("message","Logged out successfully");
                return ResponseEntity.ok(response);

    }

}
