package com.github.ahmed_zein.snippet_share.repositories;

import com.github.ahmed_zein.snippet_share.models.AppFile;
import com.github.ahmed_zein.snippet_share.models.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppFileRepository extends JpaRepository<AppFile, UUID> {
    List<AppFile> findByAppUser(AppUser user);

    Optional<AppFile> findByIdAndAppUser_IdAndIsDeletedFalse(UUID fileId, UUID userId);
}
