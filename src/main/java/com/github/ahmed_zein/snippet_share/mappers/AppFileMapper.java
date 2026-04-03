package com.github.ahmed_zein.snippet_share.mappers;

import com.github.ahmed_zein.snippet_share.dto.AppFileDto;
import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import com.github.ahmed_zein.snippet_share.models.AppFile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AppFileMapper {
    AppFile fromDto(AppFileDto fileDto);

    AppFileDto toDto(AppFile file);

    FileUploadResponse toFileUploadResponse(AppFile file);

}
