package com.github.ahmed_zein.snippet_share.mappers;

import com.github.ahmed_zein.snippet_share.dto.PublishedFileDto;
import com.github.ahmed_zein.snippet_share.models.PublishedFile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PublishedFilesMapper {
    PublishedFileDto toDto(PublishedFile publishedFile);

}
