package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.Services.AppUserService;
import com.github.ahmed_zein.snippet_share.dto.UserProfileDto;
import com.github.ahmed_zein.snippet_share.mappers.AppFileMapper;
import com.github.ahmed_zein.snippet_share.mappers.AppUserMapper;
import com.github.ahmed_zein.snippet_share.repositories.AppFileRepository;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppUserServiceImpl implements AppUserService {

    private final AppUserRepository appUserRepository;
    private final AppFileRepository appFileRepository;
    private final AppUserMapper userMapper;
    private final AppFileMapper fileMapper;

    public Optional<UserProfileDto> getUser(UUID id) {
        var userOptional = appUserRepository.findById(id);
        if (userOptional.isEmpty()) return Optional.empty();
        var user = userOptional.get();
        var files = appFileRepository.findByAppUser(user);

        var profile = userMapper.toProfileDto(user);
        profile.setFiles(files.stream().map(fileMapper::toDto).toList());


        return Optional.of(profile);
    }
}
