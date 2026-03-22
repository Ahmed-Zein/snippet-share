package com.github.ahmed_zein.snippet_share.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @PostMapping(
            path = "{userProfileId}/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Void> uploadUserProfileImage(@PathVariable("userProfileId") UUID userProfileId,
                                                       @RequestParam("file") MultipartFile file) {
        return ResponseEntity.internalServerError().build();
    }

    @GetMapping("{userProfileId}/image/download")
    public ResponseEntity<byte[]> downloadUserProfileImage(@PathVariable("userProfileId") UUID userProfileId) {
        return ResponseEntity.internalServerError().build();
    }
}
