package com.exlay.mixer.service;

import com.exlay.mixer.dto.UserResponse;
import com.exlay.mixer.model.User;
import com.exlay.mixer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse findByTag(String tag){
        User user = userRepository.findByTag(tag)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getTag(),
                user.getEmail()
        );
    }

    public UserResponse findByEmail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getTag(),
                user.getEmail()
        );
    }

}
