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
            // Admin User
            userRepository.findByEmail("admin@example.com").ifPresent(userRepository::delete);
            User admin = new User();
            admin.setFirstname("admin");
            admin.setLastname("user");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            // Regular User for testing
            userRepository.findByEmail("user@example.com").ifPresent(userRepository::delete);
            User regularUser = new User();
            regularUser.setFirstname("regular");
            regularUser.setLastname("user");
            regularUser.setEmail("user@example.com");
            regularUser.setPassword(passwordEncoder.encode("user123"));
            regularUser.setRole(Role.USER);
            userRepository.save(regularUser);
        };
    }
}
