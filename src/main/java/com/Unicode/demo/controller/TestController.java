package com.Unicode.demo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    // API này KHÔNG cần JWT token
    @GetMapping("/public")
    public String publicEndpoint() {
        return "API public - Ai cũng truy cập được không cần token!";
    }

    // API này CẦN JWT token mới truy cập được
    @GetMapping("/protected")
    public String protectedEndpoint() {
        // Lấy thông tin user đã đăng nhập từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return "API được bảo vệ - Chào " + username + "! Bạn đã đăng nhập thành công.";
    }
}