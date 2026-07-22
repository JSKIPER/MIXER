package com.exlay.mixer.controller;

import com.exlay.mixer.dto.UserResponse;
import com.exlay.mixer.model.User;
import com.exlay.mixer.repository.UserRepository;
import com.exlay.mixer.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email);


    }
    @GetMapping("/search")
    public UserResponse findByTag(@RequestParam String tag){
        return userService.findByTag(tag);


    }
}