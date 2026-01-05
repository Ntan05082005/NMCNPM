package com.Unicode.demo.security.oauth2;

import com.Unicode.demo.entity.User;
import com.Unicode.demo.enums.Role;
import com.Unicode.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Custom OAuth2 user service that handles user registration/login via OAuth2
 * providers
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId,
                oAuth2User.getAttributes());

        if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        String provider = registrationId.toUpperCase();
        String providerId = oAuth2UserInfo.getId();

        // Check if user already exists with this provider and providerId
        Optional<User> userOptional = userRepository.findByProviderAndProviderId(provider, providerId);

        User user;
        if (userOptional.isPresent()) {
            // Existing OAuth user - update their info
            user = userOptional.get();
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            // Check if user exists with same email (maybe registered normally)
            Optional<User> existingEmailUser = userRepository.findByEmail(oAuth2UserInfo.getEmail());
            if (existingEmailUser.isPresent()) {
                // Link OAuth to existing account
                user = existingEmailUser.get();
                user.setProvider(provider);
                user.setProviderId(providerId);
                if (oAuth2UserInfo.getImageUrl() != null) {
                    user.setAvatarUrl(oAuth2UserInfo.getImageUrl());
                }
                user = userRepository.save(user);
            } else {
                // New user - register them
                user = registerNewUser(oAuth2UserInfo, provider, providerId);
            }
        }

        return new CustomOAuth2User(oAuth2User, user);
    }

    private User registerNewUser(OAuth2UserInfo oAuth2UserInfo, String provider, String providerId) {
        User user = new User();

        // Generate a unique username from email or name
        String baseUsername = oAuth2UserInfo.getName() != null
                ? oAuth2UserInfo.getName().replaceAll("\\s+", "").toLowerCase()
                : oAuth2UserInfo.getEmail().split("@")[0];

        String username = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter++;
        }

        user.setUsername(username);
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setFullName(oAuth2UserInfo.getName());
        user.setAvatarUrl(oAuth2UserInfo.getImageUrl());
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setPassword(null); // OAuth users don't have password
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        if (oAuth2UserInfo.getName() != null) {
            existingUser.setFullName(oAuth2UserInfo.getName());
        }
        if (oAuth2UserInfo.getImageUrl() != null) {
            existingUser.setAvatarUrl(oAuth2UserInfo.getImageUrl());
        }
        return userRepository.save(existingUser);
    }
}
