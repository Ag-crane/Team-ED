package com.example.satellite.controller;

import com.example.satellite.domain.User;
import com.example.satellite.dto.CreateAccessTokenRequest;
import com.example.satellite.dto.CreateAccessTokenResponse;
import com.example.satellite.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class TokenApiController {

    private final TokenService tokenService;

    @PostMapping("/api/token")
    public ResponseEntity<CreateAccessTokenResponse> createNewAccessToken(@RequestBody CreateAccessTokenRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UserDetails)) {
            // 여기서 적절한 예외 처리를 수행하거나 오류 응답을 반환하세요.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) principal;
        if (!(userDetails instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) principal;

        try {
            String newAccessToken = tokenService.createNewAccessToken(user, request.getRefreshToken());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CreateAccessTokenResponse(newAccessToken));
        } catch (Exception e) {
            // 로깅을 추가하여 문제를 파악할 수 있습니다.
            // e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
