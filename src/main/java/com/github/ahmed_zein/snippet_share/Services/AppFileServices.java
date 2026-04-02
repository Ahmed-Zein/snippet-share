package com.github.ahmed_zein.snippet_share.Services;

import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface AppFileServices {
    FileUploadResponse save(UUID userId, MultipartFile file) throws IOException;

    List<FileUploadResponse> save(UUID userId, List<MultipartFile> files) throws IOException;

    byte[] download(String path, String key);

    boolean deleteFile(UUID userId, UUID fileId);
}
