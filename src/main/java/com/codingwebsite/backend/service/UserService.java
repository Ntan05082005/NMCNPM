package com.codingwebsite.backend.service;

import com.codingwebsite.backend.dto.RegisterRequest;
import com.codingwebsite.backend.dto.UserDto;
import com.codingwebsite.backend.entity.User;
import com.codingwebsite.backend.enums.Role;
import com.codingwebsite.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User service for handling user operations
 * Task: CWS-28 - Save user + default role USER
 * Task: CWS-31 - Verify password with bcrypt
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user
     * - Validates that username and email don't already exist
     * - Hashes password using BCrypt
     * - Sets default role to USER
     * - Saves user to database
     * 
     * @param request RegisterRequest containing username, email, and password
     * @return UserDto with user information (without password)
     * @throws RuntimeException if username or email already exists
     */
    @Transactional
    public UserDto register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user with hashed password and default role USER
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash
        user.setRole(Role.USER); // Default role

        // Save user to database
        User savedUser = userRepository.save(user);

        // Return UserDto (without password)
        return new UserDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole());
    }
}
