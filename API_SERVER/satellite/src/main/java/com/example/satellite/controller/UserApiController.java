package com.example.satellite.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.satellite.domain.RefreshToken;
import com.example.satellite.domain.User;
import com.example.satellite.dto.AddUserRequest;
import com.example.satellite.dto.CreateAccessTokenResponse;
import com.example.satellite.dto.LoginRequest;
import com.example.satellite.dto.LoginResponseDto;
import com.example.satellite.repository.RefreshTokenRepository;
import com.example.satellite.service.TokenService;
import com.example.satellite.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UserApiController {

    private final UserService userService;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/user")
    public ResponseEntity<CreateAccessTokenResponse> signup(@RequestBody AddUserRequest request) {
        Long userId = userService.save(request);
        User user = userService.findById(userId);
        String newAccessToken = tokenService.createAccessToken(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateAccessTokenResponse(newAccessToken));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null) {
            return ResponseEntity.badRequest().body("Email cannot be null");
        }
        if (request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Password cannot be null");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername());

        String newAccessToken = tokenService.createAccessToken(user);
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("No refresh token found"));

        LoginResponseDto responseDto = new LoginResponseDto();
        responseDto.setAccessToken(newAccessToken);
        responseDto.setRefreshToken(refreshToken.getRefreshToken());
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        return "redirect:/login";
    }

    @GetMapping("/")
    public String login() {
        return "main page";
    }

    @GetMapping("/error")
    public String error() {
        return "error page";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login page";
    }

}
