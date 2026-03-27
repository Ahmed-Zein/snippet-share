package com.github.ahmed_zein.snippet_share.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private AppUserDto user;
    @Builder.Default
    private String tokenType = "Bearer: ";
}
