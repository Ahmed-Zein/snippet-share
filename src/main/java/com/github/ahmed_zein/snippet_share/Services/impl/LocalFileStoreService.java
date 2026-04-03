package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.Services.FileStoreService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocalFileStoreService implements FileStoreService {
    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostConstruct
    public void init() throws IOException {
        var rootDir = getRootDir();
        Files.createDirectories(rootDir);
    }

    @Override
    public void save(String filePath, MultipartFile file) throws IOException {
        validateFile(file);
        var rootDir = getRootDir();

        file.transferTo(rootDir.resolve(filePath).normalize());
    }

    @Override
    public Resource download(String filePath) throws FileNotFoundException {

        var path = getRootDir().resolve(filePath).normalize();
        try {
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not readable: " + filePath);
            }
        } catch (
                MalformedURLException e) {
            log.error("Malformed URL for file: {}", filePath);
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean deleteFile(String filePath) throws IOException {
        var rootDir = getRootDir();

        var path = rootDir.resolve(filePath).normalize();
        Files.deleteIfExists(path);
        return true;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store an empty file");
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // Preventing directory traversal attacks
        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Filename contains invalid path sequence: " + originalFileName);
        }
    }

    private Path getRootDir() {
        return Path.of(uploadDir);
    }
}
