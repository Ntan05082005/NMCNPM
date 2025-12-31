package com.Unicode.demo.dto;

import lombok.Data;

@Data
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String githubLink;
    private String linkedinLink;
    private String themePreference;
    private String currentPassword; // Mật khẩu cũ (để xác thực)
    private String newPassword;     // Mật khẩu mới
}