package com.github.ahmed_zein.snippet_share.controllers;

import com.github.ahmed_zein.snippet_share.Services.AppFileServices;
import com.github.ahmed_zein.snippet_share.Services.AppUserService;
import com.github.ahmed_zein.snippet_share.dto.ApiResponse;
import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
import com.github.ahmed_zein.snippet_share.dto.PublishedFileDto;
import com.github.ahmed_zein.snippet_share.dto.UserProfileDto;
import com.github.ahmed_zein.snippet_share.models.AppUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AppFileServices fileServices;
    private final AppUserService appUserService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserData(@PathVariable UUID userId) {
        var usr = appUserService.getUser(userId);
        return usr.<ResponseEntity<ApiResponse<UserProfileDto>>>map(
                        userProfileDto -> ResponseEntity.ok(ApiResponse.ok(userProfileDto)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(
            path = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<FileUploadResponse>>> uploadUserProfileImage(@AuthenticationPrincipal AppUserPrincipal currentUser,
                                                                                        @RequestParam("files") List<MultipartFile> files) throws IOException {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        var response = fileServices.save(currentUser.user().getId(), files);

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping(path = "/files/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable("fileId") UUID fileId, @AuthenticationPrincipal AppUserPrincipal currentUser) {
        var deleted = fileServices.deleteFile(currentUser.user().getId(), fileId);
        return deleted ?
                ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }


    @PostMapping("/files/{fileId}/publish")
    public ResponseEntity<ApiResponse<PublishedFileDto>> publishFile(@PathVariable("fileId") UUID fileId, @AuthenticationPrincipal AppUserPrincipal currentUser) {
        var publishedFile = fileServices.publish(currentUser.user().getId(), fileId);
        return ResponseEntity.ok(ApiResponse.ok(publishedFile));
    }
}
