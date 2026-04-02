package com.github.ahmed_zein.snippet_share.Services;

import com.github.ahmed_zein.snippet_share.dto.AuthResponse;
import com.github.ahmed_zein.snippet_share.dto.LoginRequest;
import com.github.ahmed_zein.snippet_share.dto.SignupRequest;

public interface AuthService {
    AuthResponse register(SignupRequest request);

    AuthResponse authenticate(LoginRequest request);
}
