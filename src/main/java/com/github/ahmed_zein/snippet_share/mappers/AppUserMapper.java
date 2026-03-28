package com.github.ahmed_zein.snippet_share.mappers;

import com.github.ahmed_zein.snippet_share.dto.AppUserDto;
import com.github.ahmed_zein.snippet_share.dto.UserProfileDto;
import com.github.ahmed_zein.snippet_share.models.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AppUserMapper {

    AppUser fromDto(AppUserDto dto);

    AppUserDto toDto(AppUser user);

    UserProfileDto toProfileDto(AppUser file);
}
