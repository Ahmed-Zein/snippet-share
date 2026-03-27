package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.Services.FileStoreService;
import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import com.github.ahmed_zein.snippet_share.models.AppFile;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalFileStoreService implements FileStoreService {
    private final AppUserRepository appUserRepository;

    @Override
    public FileUploadResponse save(UUID userId, MultipartFile file) {
        var user = appUserRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));
        var appFile = AppFile.fromFile(file, user);
        user.addFile(appFile);
        appUserRepository.save(user);
        return FileUploadResponse.builder().success(true).fileType(appFile.getContentType()).fileName(appFile.getOriginalFileName()).url(appFile.getPath()).build();
    }

    @Override
    public List<FileUploadResponse> save(UUID userId, List<MultipartFile> files) {
        return files.stream().map((file) -> this.save(userId, file)).toList();
    }

    @Override
    public byte[] download(String path, String key) {
        return new byte[0];
    }
}
