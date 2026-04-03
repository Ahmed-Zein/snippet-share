package com.github.ahmed_zein.snippet_share.Services;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;

public interface FileStoreService {
    void save(String filePath, MultipartFile file) throws IOException;

    Resource download(String path) throws FileNotFoundException;

    boolean deleteFile(String filePath) throws IOException;
}
