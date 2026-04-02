package com.github.ahmed_zein.snippet_share.Services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStoreService {
    void save(String filePath, MultipartFile file) throws IOException;

    byte[] download(String path, String key);

    boolean deleteFile(String filePath) throws IOException;
}
