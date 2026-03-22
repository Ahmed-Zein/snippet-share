package com.github.ahmed_zein.snippet_share.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppFileDto {
    private UUID id;

    private String originalFileName;

    private Long size;

    private String contentType;

    private String path;

    private LocalDateTime accessed;

    private LocalDateTime createdAt;

}
