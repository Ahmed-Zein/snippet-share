package com.github.ahmed_zein.snippet_share.repositories;

import com.github.ahmed_zein.snippet_share.models.PublishedFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PublishedFileRepository extends JpaRepository<PublishedFile, UUID> {
}
