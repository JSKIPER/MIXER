package com.exlay.mixer.service;

import com.exlay.mixer.dto.AuthResponse;
import com.exlay.mixer.dto.LoginRequest;
import com.exlay.mixer.dto.RegisterRequest;
import com.exlay.mixer.model.User;
import com.exlay.mixer.repository.UserRepository;
import com.exlay.mixer.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if(userRepository.existsByTag(registerRequest.getTag())) {
            throw new RuntimeException("Tag already exists");
        }

        User user = User.builder().username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .tag(registerRequest.getTag())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getId());

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));


        String token = jwtUtil.generateToken(user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .build();
    }


}
