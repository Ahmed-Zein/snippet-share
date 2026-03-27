package com.github.ahmed_zein.snippet_share.repositories;

import com.github.ahmed_zein.snippet_share.models.AppUser;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class AppUserRepositoryTest {
    @Autowired
    private AppUserRepository appUserRepository;

    @Test
    public void AppUserRepository_saveAll_ReturnsSavedUsers() {
        // Arrange
        var appUser = AppUser.builder().name("GreyBeast").email("greybeas1t@email.com").password("unhashedPassword").build();

        // Act
        var savedUser = appUserRepository.saveAndFlush(appUser);

        // Assert
        Assertions.assertThat(savedUser).isNotNull();
        Assertions.assertThat(savedUser.getId()).isNotNull();
    }

    @Test
    public void AppUserRepository_FindById_ReturnsSavedUsers() {
        // Arrange
        var appUser = AppUser.builder().name("GreyBeast").email("greybeas1t@email.com").password("unhashedPassword").build();
        var savedUser = appUserRepository.saveAndFlush(appUser);

        // Act
        var result = appUserRepository.findById(savedUser.getId());

        // Assert
        Assertions.assertThat(result.isPresent()).isTrue();
        Assertions.assertThat(result.get().getId()).isNotNull();
    }

    @Test
    public void AppUserRepository_findByEmailIgnoreCase_ReturnsTheSavedUser() {
        // Arrange
        var emailUnderTest = "greybeas1t@email.com";
        var appUser = AppUser.builder().name("GreyBeast").email(emailUnderTest).password("unhashedPassword").build();

        var savedUser = appUserRepository.saveAndFlush(appUser);
        // Act
        var result = appUserRepository.findByEmailIgnoreCase(emailUnderTest.toUpperCase());

        // Assert
        Assertions.assertThat(result.isPresent()).isTrue();
        Assertions.assertThat(result.get()).isNotNull();
    }
}
