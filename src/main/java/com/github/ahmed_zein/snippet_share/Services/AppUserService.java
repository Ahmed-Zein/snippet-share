package com.github.ahmed_zein.snippet_share.Services;

import com.github.ahmed_zein.snippet_share.dto.UserProfileDto;

import java.util.Optional;
import java.util.UUID;

public interface AppUserService {
    Optional<UserProfileDto> getUser(UUID id);

}
