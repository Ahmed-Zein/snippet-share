package com.github.ahmed_zein.snippet_share.Services.impl;

import com.github.ahmed_zein.snippet_share.models.AppUser;
import com.github.ahmed_zein.snippet_share.models.AppUserPrincipal;
import com.github.ahmed_zein.snippet_share.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
    private final AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        AppUser user = appUserRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new AppUserPrincipal(user);
    }
}