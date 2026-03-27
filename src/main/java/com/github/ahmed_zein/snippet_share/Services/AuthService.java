package com.github.ahmed_zein.snippet_share.Services;

import com.github.ahmed_zein.snippet_share.dto.AppUserDto;
import com.github.ahmed_zein.snippet_share.dto.AuthResponse;
import com.github.ahmed_zein.snippet_share.dto.LoginRequest;
import com.github.ahmed_zein.snippet_share.dto.SignupRequest;
import com.github.ahmed_zein.snippet_share.models.AppRoles;
import com.github.ahmed_zein.snippet_share.models.AppUser;
import com.github.ahmed_zein.snippet_share.models.AppUserPrincipal;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(SignupRequest request) {
        var user = AppUser.builder().name(request.name()).email(request.email()).password(passwordEncoder.encode(request.password())).role(AppRoles.USER).build();

        appUserRepository.save(user);

        var jwt = jwtService.generateToken(new AppUserPrincipal(user));

        return AuthResponse.builder()
                .user(AppUserDto.builder()
                        .id(user.getId()).email(user.getEmail()).name(user.getName())
                        .build()
                )
                .token(jwt).build();
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        var user = appUserRepository.findByEmailIgnoreCase(request.email()).orElseThrow();

        var jwt = jwtService.generateToken(new AppUserPrincipal(user));

        return AuthResponse.builder()
                .user(AppUserDto.builder()
                        .id(user.getId()).email(user.getEmail()).name(user.getName())
                        .build()
                )
                .token(jwt).build();
    }
}