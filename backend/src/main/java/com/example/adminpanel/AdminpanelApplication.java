package com.example.adminpanel;

import com.example.adminpanel.entity.Role;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AdminpanelApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminpanelApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // Admin User - only create if doesn't exist
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setFirstname("admin");
                admin.setLastname("user");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user created");
            } else {
                System.out.println("Admin user already exists");
            }

            // Regular User for testing - only create if doesn't exist
            if (userRepository.findByEmail("user@example.com").isEmpty()) {
                User regularUser = new User();
                regularUser.setFirstname("regular");
                regularUser.setLastname("user");
                regularUser.setEmail("user@example.com");
                regularUser.setPassword(passwordEncoder.encode("user123"));
                regularUser.setRole(Role.USER);
                userRepository.save(regularUser);
                System.out.println("Regular user created");
            } else {
                System.out.println("Regular user already exists");
            }
        };
    }
}
