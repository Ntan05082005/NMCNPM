package com.Unicode.demo.controller;

import com.Unicode.demo.dto.UserProfileDto;
import com.Unicode.demo.entity.User;
import com.Unicode.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setGithubLink(user.getGithubLink());
        dto.setLinkedinLink(user.getLinkedinLink());
        dto.setThemePreference(user.getThemePreference());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDto request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update basic info
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getGithubLink() != null) user.setGithubLink(request.getGithubLink());
        if (request.getLinkedinLink() != null) user.setLinkedinLink(request.getLinkedinLink());
        if (request.getThemePreference() != null) user.setThemePreference(request.getThemePreference());

        // Handle Email update (should ideally verify uniqueness)
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        // Handle Password Change
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            // 1. Kiểm tra xem người dùng có gửi mật khẩu cũ không
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu.");
            }

            // 2. Kiểm tra mật khẩu cũ có khớp với trong DB không
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Mật khẩu hiện tại không đúng.");
            }

            // 3. Nếu đúng, mã hóa và lưu mật khẩu mới
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }
}