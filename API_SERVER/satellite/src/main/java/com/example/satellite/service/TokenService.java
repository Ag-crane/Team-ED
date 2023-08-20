package com.example.satellite.service;

import com.example.satellite.config.jwt.TokenProvider;
import com.example.satellite.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class TokenService {

    private final TokenProvider tokenProvider;

    public String createAccessToken(User user) {
        return tokenProvider.generateToken(user, Duration.ofHours(2));
    }

    public String createRefreshToken(User user) {
        return tokenProvider.generateToken(user, Duration.ofDays(14));
    }

    public String createNewAccessToken(User user, String refreshToken) {
        // 토큰 유효성 검사에 실패하면 예외 발생
        if(!tokenProvider.validToken(refreshToken)) {
            throw new IllegalArgumentException("Unexpected token");
        }

        return tokenProvider.generateToken(user, Duration.ofHours(2));
    }
}