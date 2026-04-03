package com.github.ahmed_zein.snippet_share.controllers;

import jakarta.websocket.server.PathParam;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/pub")
@RestController
public class PublishedFilesController {
    @GetMapping("{shortUrl}")
    public ResponseEntity<Void> getFile(@PathParam("shortUrl") String shortUrl) {
        return ResponseEntity.ok().build();
    }
}
