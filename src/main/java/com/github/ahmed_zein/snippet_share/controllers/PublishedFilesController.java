package com.github.ahmed_zein.snippet_share.controllers;

import com.github.ahmed_zein.snippet_share.Services.AppFileServices;
import com.github.ahmed_zein.snippet_share.dto.PublishedFileDto;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/pub")
@RestController
@RequiredArgsConstructor
public class PublishedFilesController {
    private final AppFileServices appFileServices;

    @GetMapping(path = "/{shortUrl}/info")
    public ResponseEntity<PublishedFileDto> getFileInfo(@PathParam("shortUrl") String shortUrl) {
        var info = appFileServices.getPublishedFileInfo(shortUrl);
        return ResponseEntity.ok(info);
    }

    @GetMapping(path = "/{shortUrl}")
    public ResponseEntity<Resource> getFile(@PathParam("shortUrl") String shortUrl) {
        var file = appFileServices.getPublishedFile(shortUrl);
        var info = appFileServices.getPublishedFileInfo(shortUrl);

        String contentType = info.getAppFile().getContentType();
        String fileName = info.getAppFile().getOriginalFileName();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(file);
    }
}
