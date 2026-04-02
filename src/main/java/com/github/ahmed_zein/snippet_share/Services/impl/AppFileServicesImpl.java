package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.Services.AppFileServices;
import com.github.ahmed_zein.snippet_share.Services.FileStoreService;
import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import com.github.ahmed_zein.snippet_share.models.AppFile;
import com.github.ahmed_zein.snippet_share.repositories.AppFileRepository;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppFileServicesImpl implements AppFileServices {
    private final AppUserRepository userRepository;
    private final AppFileRepository fileRepository;
    private final FileStoreService fileStoreService;

    @Override
    @Transactional
    public FileUploadResponse save(UUID userId, MultipartFile file) throws IOException {
        var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));
        var appFile = AppFile.fromFile(file, user);

        user.addFile(appFile);
        fileStoreService.save(appFile.getPath(), file);

        userRepository.save(user);

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
    @Transactional
    public byte[] download(String path, String key) {
        return new byte[0];
    }

    @Override
    public boolean deleteFile(UUID userId, UUID fileId) {
        var file = fileRepository.findById(fileId).orElseThrow(() -> new IllegalArgumentException("File not found"));
        if (!file.getAppUser().getId().equals(userId)) {
            throw new IllegalArgumentException("The File doesn't belong to the current user");
        }
        try {
            fileStoreService.deleteFile(file.getPath());
            fileRepository.delete(file);
            return true;
        } catch (IOException e) {
            throw new IllegalArgumentException("Unknown Error Occurred");
        }
    }

}
