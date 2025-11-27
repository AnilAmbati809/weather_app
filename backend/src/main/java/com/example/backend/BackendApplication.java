package com.example.backend;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner init(RoleRepository roleRepo, UserRepository userRepo) {
        return args -> {
            if (roleRepo.findByName("ROLE_USER").isEmpty()) {
                roleRepo.save(new Role("ROLE_USER"));
            }
            if (roleRepo.findByName("ROLE_ADMIN").isEmpty()) {
                roleRepo.save(new Role("ROLE_ADMIN"));
            }

            if (userRepo.findByUsername("admin").isEmpty()) {
                Role adminRole = roleRepo.findByName("ROLE_ADMIN").get();
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.getRoles().add(adminRole);
                userRepo.save(admin);
            }
        };
    }
}
