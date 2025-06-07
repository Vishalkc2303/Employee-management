package com.poject.employee.Confiig;

import com.poject.employee.Entity.Role;
import com.poject.employee.Entity.RoleName;
import com.poject.employee.Entity.User;
import com.poject.employee.Repo.RoleRepository;
import com.poject.employee.Repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class DataIntializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Create roles if not exist
            for (RoleName roleName : RoleName.values()) {
                roleRepository.findByName(roleName).orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
            }

            // Create default SUPER_ADMIN user if not exist
            String defaultAdminEmail = "admin@company.com";
            if (userRepository.findByEmail(defaultAdminEmail).isEmpty()) {
                Role superAdminRole = roleRepository.findByName(RoleName.SUPER_ADMIN)
                        .orElseThrow(() -> new RuntimeException("SUPER_ADMIN role not found"));

                User superAdmin = new User();
                superAdmin.setEmail(defaultAdminEmail);
                superAdmin.setPassword(passwordEncoder.encode("admin123"));
                superAdmin.setRole(superAdminRole);
                superAdmin.setActive(true);

                userRepository.save(superAdmin);
                System.out.println("Default SUPER_ADMIN created.");
            }
        };
    }
}
