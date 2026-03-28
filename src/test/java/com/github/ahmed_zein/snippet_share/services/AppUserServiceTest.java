package com.github.ahmed_zein.snippet_share.services;


import com.github.ahmed_zein.snippet_share.Services.AppUserService;
import com.github.ahmed_zein.snippet_share.dto.AppFileDto;
import com.github.ahmed_zein.snippet_share.dto.UserProfileDto;
import com.github.ahmed_zein.snippet_share.mappers.AppFileMapper;
import com.github.ahmed_zein.snippet_share.mappers.AppUserMapper;
import com.github.ahmed_zein.snippet_share.models.AppFile;
import com.github.ahmed_zein.snippet_share.models.AppRoles;
import com.github.ahmed_zein.snippet_share.models.AppUser;
import com.github.ahmed_zein.snippet_share.repositories.AppFileRepository;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;

@Slf4j
@ExtendWith(MockitoExtension.class)
public class AppUserServiceTest {
    @Mock
    private AppUserRepository userRepository;
    @Mock
    private AppFileRepository fileRepository;
    @Mock
    private AppUserMapper userMapper;
    @Mock
    private AppFileMapper fileMapper;

    @InjectMocks
    private AppUserService userService;
    private UUID userId;
    private AppUser appUser;
    private UserProfileDto userProfileDto;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        appUser = AppUser.builder()
                .id(userId)
                .name("GreyBeast")
                .email("greybeast@email.com")
                .password("password")
                .role(AppRoles.USER)
                .build();

        userProfileDto = new UserProfileDto();
        userProfileDto.setFiles(new ArrayList<>());
    }

    @Test
    public void appUser_GetUser_ReturnUserProfile() {
        // Arrange
        var appFile = AppFile.builder()
                .id(UUID.randomUUID())
                .appUser(appUser)
                .build();

        var appFileDto = new AppFileDto();

        when(userRepository.findById(userId)).thenReturn(Optional.of(appUser));
        when(fileRepository.findByAppUser(appUser)).thenReturn(List.of(appFile));
        when(userMapper.toProfileDto(appUser)).thenReturn(userProfileDto);
        when(fileMapper.toDto(appFile)).thenReturn(appFileDto);

        // Act
        var result = userService.getUser(userId);

        // Assert
        Assertions.assertThat(result.isPresent()).isTrue();
        Assertions.assertThat(result.get()).isNotNull();
        Assertions.assertThat(result.get().getFiles()).hasSize(1);

        verify(userRepository, times(1)).findById(userId);
        verify(fileRepository, times(1)).findByAppUser(appUser);
        verify(userMapper, times(1)).toProfileDto(appUser);
        verify(fileMapper, times(1)).toDto(appFile);
    }

}
