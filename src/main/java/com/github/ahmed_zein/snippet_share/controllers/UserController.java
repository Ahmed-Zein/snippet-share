package com.github.ahmed_zein.snippet_share.controllers;

import com.github.ahmed_zein.snippet_share.Services.AppUserService;
import com.github.ahmed_zein.snippet_share.Services.FileStoreService;
import com.github.ahmed_zein.snippet_share.dto.ApiResponse;
import com.github.ahmed_zein.snippet_share.dto.FileUploadResponse;
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

    private final FileStoreService fileStoreService;
    private final AppUserService appUserService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDto> getUserData(@PathVariable UUID userId) {
        var usr = appUserService.getUser(userId);
        return usr.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(
            path = "/{userId}/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<FileUploadResponse>>> uploadUserProfileImage(@PathVariable("userId") UUID userId,
                                                              @AuthenticationPrincipal AppUserPrincipal currentUser,
                                                              @RequestParam("files") List<MultipartFile> files) throws IOException {

        if (!userId.equals(currentUser.user().getId())) {
            return ResponseEntity.badRequest().build();
        }
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        var response = fileStoreService.save(userId, files);

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("{userProfileId}/image/download")
    public ResponseEntity<byte[]> downloadUserProfileImage(@PathVariable("userProfileId") UUID userProfileId) {
        return ResponseEntity.internalServerError().build();
    }
}
