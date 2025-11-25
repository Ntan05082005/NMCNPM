package com.example.jwtdemo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    // YÊU CẦU 2: FILTER ĐỂ CHECK AUTHORIZATION
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        // Bỏ qua các endpoint public
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth/") || path.equals("/api/test/public")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // BƯỚC 1: Lấy JWT token từ header "Authorization"
            String jwt = extractTokenFromRequest(request);

            // BƯỚC 2: Nếu có token và token hợp lệ
            if (jwt != null && jwtUtils.validateToken(jwt)) {

                // BƯỚC 3: Lấy username từ token
                String username = jwtUtils.getUsernameFromToken(jwt);

                // BƯỚC 4: Tạo authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                new ArrayList<>());

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // BƯỚC 5: Set authentication vào SecurityContext
                // => User đã được xác thực, có thể truy cập các API được bảo vệ
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.out.println("Không thể set authentication: " + e.getMessage());
        }

        // Cho phép request tiếp tục đi qua các filter khác
        filterChain.doFilter(request, response);
    }

    // Hàm phụ: Extract JWT token từ header
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        // Header có dạng: "Bearer eyJhbGciOiJIUzI1..."
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Bỏ chữ "Bearer " ở đầu
        }

        return null;
    }
}