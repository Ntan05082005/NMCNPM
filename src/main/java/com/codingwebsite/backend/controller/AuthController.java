package com.codingwebsite.backend.controller;

import com.codingwebsite.backend.dto.RegisterRequest;
import com.codingwebsite.backend.dto.UserDto;
import com.codingwebsite.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller
 * Task: CWS-26 - Validate registration fields
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user
     * 
     * @Valid annotation triggers validation on RegisterRequest
     * 
     * @param request RegisterRequest with username, email, and password
     * @return UserDto with created user information
     */
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        UserDto userDto = userService.register(request);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }
}
