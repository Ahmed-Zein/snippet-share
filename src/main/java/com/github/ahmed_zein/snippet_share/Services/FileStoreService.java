package com.github.ahmed_zein.snippet_share.Services;

import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface FileStoreService {
    FileUploadResponse save(UUID userId, MultipartFile file);

    List<FileUploadResponse> save(UUID userId, List<MultipartFile> files);

    byte[] download(String path, String key);
}
