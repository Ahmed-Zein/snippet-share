package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.Services.FileStoreService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
public class LocalFileStoreService implements FileStoreService {
    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    @Transactional
    public void save(String filePath, MultipartFile file) throws IOException {
        var rootDir = getRootDir();

        Files.createDirectories(rootDir);
        file.transferTo(rootDir.resolve(filePath));
    }

    @Override
    @Transactional
    public byte[] download(String path, String key) {
        throw new NotImplementedException();
    }

    @Override
    public boolean deleteFile(String filePath) throws IOException {
        var rootDir = getRootDir();

        var path = rootDir.resolve(filePath);
        Files.deleteIfExists(path);
        return true;
    }

    private Path getRootDir() {
        return Path.of(uploadDir);
    }
}
