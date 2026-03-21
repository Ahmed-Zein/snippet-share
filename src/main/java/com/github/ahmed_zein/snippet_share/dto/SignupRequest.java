package com.github.ahmed_zein.snippet_share.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record SignupRequest(@Email @NotNull @NotBlank String email,
                            @NotNull @NotBlank @Size(min = 6) String password,
                            @NotNull @NotBlank @Size(min = 6, max = 255) String name) {
}
