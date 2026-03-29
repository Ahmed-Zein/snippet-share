package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.Services.FileStoreService;
import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import com.github.ahmed_zein.snippet_share.models.AppFile;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalFileStoreService implements FileStoreService {
    private final AppUserRepository appUserRepository;
    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    @Transactional
    public FileUploadResponse save(UUID userId, MultipartFile file) throws IOException {
        final Path destination = Path.of(uploadDir);
        var user = appUserRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));
        var appFile = AppFile.fromFile(file, user);

        user.addFile(appFile);

        Files.createDirectories(destination);
        file.transferTo(destination.resolve(appFile.getPath()));

        appUserRepository.save(user);

        return FileUploadResponse
                .builder()
                .success(true)
                .fileSize(appFile.getSize())
                .fileType(appFile.getContentType())
                .fileName(appFile.getOriginalFileName())
                .url(appFile.getPath())
                .build();
    }

    @Override
    @Transactional
    public List<FileUploadResponse> save(UUID userId, List<MultipartFile> files) throws IOException {
        var list = new ArrayList<FileUploadResponse>();
        for (MultipartFile file : files) {
            var save = this.save(userId, file);
            list.add(save);
        }
        return list;
    }

    @Override
    public byte[] download(String path, String key) {
        return new byte[0];
    }
}
