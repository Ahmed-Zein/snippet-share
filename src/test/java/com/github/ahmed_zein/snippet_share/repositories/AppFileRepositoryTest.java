package com.github.ahmed_zein.snippet_share.repositories;

import com.github.ahmed_zein.snippet_share.models.AppFile;
import com.github.ahmed_zein.snippet_share.models.AppUser;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class AppFileRepositoryTest {
    @Autowired
    private AppFileRepository appFileRepository;
    @Autowired
    private AppUserRepository appUserRepository;

    @Test
    public void AppFileRepository_Save_ReturnsSavedFile() {
        // Arrange
        var appUser = saveMockUser();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello, World!".getBytes()
        );
        var appFile = AppFile.fromFile(file, appUser);

        // Act
        var savedFile = appFileRepository.saveAndFlush(appFile);

        // Assert
        Assertions.assertThat(savedFile).isNotNull();
        Assertions.assertThat(savedFile.getAppUser()).isNotNull();
    }

    @Test
    public void AppFileRepository_FindFilesByUser_ReturnsSavedFile() {
        // Arrange
        var appUser = saveMockUser();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello, World!".getBytes()
        );
        var appFile = AppFile.fromFile(file, appUser);
        var savedFile = appFileRepository.saveAndFlush(appFile);

        // Act
        var list = appFileRepository.findByAppUser(appUser);

        // Assert
        Assertions.assertThat(list).isNotNull();
        Assertions.assertThat(list.size()).isEqualTo(1);
    }


    private AppUser saveMockUser() {
        var appUser = AppUser.builder().name("GreyBeast").email("greybeas1t@email.com").password("unhashedPassword").build();
        return appUserRepository.saveAndFlush(appUser);
    }
}
