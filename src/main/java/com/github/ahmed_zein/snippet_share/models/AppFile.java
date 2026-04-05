package com.github.ahmed_zein.snippet_share.models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "files")
public class AppFile {
    @Builder.Default
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public AppFileStatus status = AppFileStatus.PRIVATE;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser appUser;
    @Column(nullable = false)
    private String originalFileName;
    @Column(nullable = false)
    private Long size;
    // should I prevent duplicates and optimize space based on this? (no file updates, soft deletes will help)???
    @Column(nullable = false)
    private String checksum;
    @Column(nullable = false)
    private String contentType;
    @Column(nullable = false, unique = true)
    private String path;
    @Column(nullable = false)
    private LocalDateTime accessed;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    @Builder.Default
    private boolean isDeleted = false;
    private LocalDateTime deletedAt;
    @OneToOne(mappedBy = "appFile")
    private PublishedFile publishedFile;

    public static AppFile fromFile(MultipartFile file, AppUser user) {
        return AppFile.builder()
                .appUser(user)
                .originalFileName(file.getOriginalFilename())
                .contentType(file.getContentType())
                .size(file.getSize())
                .checksum("TODO")
                .path(UUID.randomUUID() + file.getOriginalFilename())
                .build();
    }

    @PrePersist
    public void onCreate() {
        var now = LocalDateTime.now();
        this.createdAt = now;
        this.accessed = now;
    }
}
