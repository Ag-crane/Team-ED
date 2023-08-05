package com.example.satellite.service;

import com.example.satellite.domain.RefreshToken;
import com.example.satellite.domain.User;
import com.example.satellite.dto.AddUserRequest;
import com.example.satellite.repository.RefreshTokenRepository;
import com.example.satellite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final TokenService tokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    public Long save(AddUserRequest dto) {
        if (dto.getPassword() == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }

        User user = userRepository.save(User.builder()
                .email(dto.getEmail())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .build());

        String newRefreshToken = tokenService.createRefreshToken(user);
        refreshTokenRepository.save(new RefreshToken(user.getId(), newRefreshToken));

        return user.getId();
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected user"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected user"));
    }
}
