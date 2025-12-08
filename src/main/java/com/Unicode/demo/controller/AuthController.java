package com.Unicode.demo.controller;

import com.Unicode.demo.entity.User;
import com.Unicode.demo.enums.Role;
import com.Unicode.demo.repository.UserRepository;
import com.Unicode.demo.security.JwtUtils;
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
        try {
            String username = request.get("username");
            String password = request.get("password");
            String email = request.get("email");

            // Validation: Check for empty fields
            if (username == null || username.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Username không được để trống!");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            if (password == null || password.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Password không được để trống!");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Email không được để trống!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Kiểm tra username đã tồn tại
            if (userRepository.findByUsername(username).isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Username đã tồn tại!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Kiểm tra email đã tồn tại
            if (userRepository.findByEmail(email).isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Email đã tồn tại!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Kiểm tra format email cơ bản
            if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Email không đúng định dạng!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Tạo user mới
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));  // Mã hóa password
            user.setRole(Role.USER);

            userRepository.save(user);

            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "Đăng ký thành công!");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Lỗi khi đăng ký: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // API login - GENERATE JWT TOKEN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            // Validation: Check for empty fields
            if (username == null || username.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Username không được để trống!");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            if (password == null || password.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Password không được để trống!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Tìm user trong database
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User không tồn tại!");
                return ResponseEntity.status(404).body(errorResponse);
            }

            // Kiểm tra password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Sai password!");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // GENERATE JWT TOKEN
            String token = jwtUtils.generateToken(username);

            // Trả về token cho client
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Lỗi khi đăng nhập: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}