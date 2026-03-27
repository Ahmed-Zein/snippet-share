package com.github.ahmed_zein.snippet_share.controllers;

import com.github.ahmed_zein.snippet_share.Services.AuthService;
import com.github.ahmed_zein.snippet_share.dto.ApiResponse;
import com.github.ahmed_zein.snippet_share.dto.AuthResponse;
import com.github.ahmed_zein.snippet_share.dto.LoginRequest;
import com.github.ahmed_zein.snippet_share.dto.SignupRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/singup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest req) {
        return new ResponseEntity<>(ApiResponse.ok(authService.register(req)), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        return new ResponseEntity<>(ApiResponse.ok(authService.authenticate(req)), HttpStatus.OK);
    }
}
