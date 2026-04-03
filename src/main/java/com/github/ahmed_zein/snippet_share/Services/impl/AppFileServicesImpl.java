package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.Services.AppFileServices;
import com.github.ahmed_zein.snippet_share.Services.FileStoreService;
import com.github.ahmed_zein.snippet_share.Services.UrlShortener;
import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import com.github.ahmed_zein.snippet_share.dto.PublishedFileDto;
import com.github.ahmed_zein.snippet_share.mappers.AppFileMapper;
import com.github.ahmed_zein.snippet_share.mappers.PublishedFilesMapper;
import com.github.ahmed_zein.snippet_share.models.AppFile;
import com.github.ahmed_zein.snippet_share.models.AppFileStatus;
import com.github.ahmed_zein.snippet_share.models.PublishedFile;
import com.github.ahmed_zein.snippet_share.repositories.AppFileRepository;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import com.github.ahmed_zein.snippet_share.repositories.PublishedFileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
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
    private final PublishedFileRepository publishedFileRepository;
    private final FileStoreService fileStoreService;
    private final UrlShortener urlShortener;
    private final AppFileMapper appFileMapper;
    private final PublishedFilesMapper publishedFilesMapper;

    @Override
    @Transactional
    public FileUploadResponse save(UUID userId, MultipartFile file) throws IOException {
        var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("user not found"));
        var appFile = AppFile.fromFile(file, user);

        user.addFile(appFile);
        fileStoreService.save(appFile.getPath(), file);

        return appFileMapper.toFileUploadResponse(fileRepository.save(appFile));
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

    @Override
    public PublishedFileDto publish(UUID userId, UUID fileId) {
        var file = fileRepository.findByIdAndAppUser_IdAndIsDeletedFalse(fileId, userId).orElseThrow();
        var shortUrl = urlShortener.shorten(fileId);
        var publishedFile = PublishedFile.builder()
                .shortURL(shortUrl)
                .appFile(file)
                .build();

        file.status= AppFileStatus.PUBLISHED;
        fileRepository.save(file);
        return publishedFilesMapper.toDto(publishedFileRepository.save(publishedFile));
    }

    @Override
    public Resource getPublishedFile(String shortUrl) {
        var publishedFile = publishedFileRepository.findByShortURL(shortUrl).orElseThrow();
        try {
            return fileStoreService.download(publishedFile.getAppFile().getPath());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


}
