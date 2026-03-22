package com.github.ahmed_zein.snippet_share.Services;

import com.github.ahmed_zein.snippet_share.dto.AppFileDto;
import com.github.ahmed_zein.snippet_share.dto.UserProfileDto;
import com.github.ahmed_zein.snippet_share.repositories.AppFileRepository;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AppFileRepository appFileRepository;

    public Optional<UserProfileDto> getUser(UUID id) {
        var userOptional = appUserRepository.findById(id);
        if (userOptional.isEmpty()) return Optional.empty();
        var user = userOptional.get();
        var files = appFileRepository.findByAppUser(user);

        // TODO: user map-struct
        var profile = UserProfileDto.builder();
        profile.id(user.getId());
        profile.email(user.getEmail());
        profile.name(user.getName());
        profile.files(files.stream().map(appFile -> AppFileDto.builder()
                .id(appFile.getId())
                .accessed(appFile.getAccessed())
                .createdAt(appFile.getCreatedAt())
                .path(appFile.getPath())
                .contentType(appFile.getContentType())
                .originalFileName(appFile.getOriginalFileName())
                .build()).toList());

        return Optional.of(profile.build());
    }
}
