package com.github.ahmed_zein.snippet_share.controllers;

import com.github.ahmed_zein.snippet_share.Services.AppFileServices;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
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

    @GetMapping(path = "{shortUrl}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> getFile(@PathParam("shortUrl") String shortUrl) {
        var resource = appFileServices.getPublishedFile(shortUrl);
        return ResponseEntity.ok(resource);
    }
}
