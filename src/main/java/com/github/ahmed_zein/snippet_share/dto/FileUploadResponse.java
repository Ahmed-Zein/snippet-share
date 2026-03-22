package com.github.ahmed_zein.snippet_share.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileUploadResponse {
    private String fileName;
    private String fileType;
    private long fileSize;
    private String url;
    private boolean success;
    private String errorMessage;

}