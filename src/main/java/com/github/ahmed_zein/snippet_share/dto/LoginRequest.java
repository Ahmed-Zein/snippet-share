package com.github.ahmed_zein.snippet_share.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record LoginRequest(@Email @NotNull @NotBlank String email, @NotNull @NotBlank String password) {
}
