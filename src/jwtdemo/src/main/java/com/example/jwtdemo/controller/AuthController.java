package com.example.jwtdemo.controller;

import com.example.jwtdemo.model.User;
import com.example.jwtdemo.repository.UserRepository;
import com.example.jwtdemo.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // API đăng ký user mới
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        // Tạo user mới
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));  // Mã hóa password
        user.setRole("USER");

        userRepository.save(user);

        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // API login - GENERATE JWT TOKEN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        // Tìm user trong database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));

        // Kiểm tra password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Sai password!");
        }

        // GENERATE JWT TOKEN
        String token = jwtUtils.generateToken(username);

        // Trả về token cho client
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", username);

        return ResponseEntity.ok(response);
    }
}