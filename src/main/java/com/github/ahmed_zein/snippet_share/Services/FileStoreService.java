package com.github.ahmed_zein.snippet_share.Services;

import java.io.InputStream;

public interface FileStoreService {
    void save(String path, String fileName, InputStream inputStream);

    byte[] download(String path, String key);
}
