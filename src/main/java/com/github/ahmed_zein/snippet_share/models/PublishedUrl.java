package com.github.ahmed_zein.snippet_share.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "publishedUrl")
public class PublishedUrl {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String shortURL;

    @OneToOne()
    @JoinColumn(nullable = false)
    private AppFile appFile;
}
