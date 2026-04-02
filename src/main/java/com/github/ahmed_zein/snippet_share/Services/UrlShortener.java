package com.github.ahmed_zein.snippet_share.Services;

import java.util.UUID;

public interface UrlShortener {
    String shorten(UUID url);
}

