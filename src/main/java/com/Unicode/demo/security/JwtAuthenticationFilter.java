package com.Unicode.demo.security;

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

import com.Unicode.demo.repository.UserRepository;
import com.Unicode.demo.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private UserRepository userRepository;

    // SOLUTION: Override shouldNotFilter instead of checking in doFilterInternal
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        System.out.println("🔍 Checking if should filter: " + path);
        
        // Only skip auth endpoints - process JWT for all other endpoints
        // This allows /api/problems to get user context if token is present
        boolean skip = path.startsWith("/api/auth") 
                    || path.startsWith("/api/test/public")
                    || path.startsWith("/api/debug")
                    || path.startsWith("/api/tags");
        
        if (skip) {
            System.out.println("✅ Skipping JWT filter for public endpoint: " + path);
        } else {
            System.out.println("🔒 Will process JWT for endpoint: " + path);
        }
        
        return skip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {

        // This only runs if shouldNotFilter() returns false
        System.out.println("🔐 Processing JWT authentication for: " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            if (jwtUtils.validateToken(jwt)) {
                String username = jwtUtils.getUsernameFromToken(jwt);
                
                Optional<User> userOptional = userRepository.findByUsername(username);
                
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    
                    String roleName = "ROLE_" + user.getRole().name();
                    var authorities = List.of(new SimpleGrantedAuthority(roleName));
                    
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    System.out.println("✅ User authenticated: " + username + " with role: " + roleName);
                } else {
                    System.out.println("❌ User not found in database: " + username);
                }
            } else {
                System.out.println("❌ JWT token validation failed");
            }
        } else {
            System.out.println("❌ No valid Authorization header found");
        }

        filterChain.doFilter(request, response);
    }
}
