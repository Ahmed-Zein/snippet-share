package com.github.ahmed_zein.snippet_share.dto;

import com.github.ahmed_zein.snippet_share.models.AppFileStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileUploadResponse {
    private UUID id;
    private String originalFileName;
    private String contentType;
    private long size;
    @Builder.Default
    private boolean success = true;
    private String errorMessage;
    private AppFileStatus status;
}