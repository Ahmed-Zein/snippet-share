package com.github.ahmed_zein.snippet_share.dto;

public sealed interface ApiResponse<T> permits ApiResponse.Success, ApiResponse.Failed {
    static <T> Success<T> ok(T data) {
        return new Success<>(data, true);
    }

    static Failed fail(String message) {
        return new Failed(message, true);
    }

    record Success<T>(T data, boolean success) implements ApiResponse<T> {
    }

    record Failed(String message, boolean success) implements ApiResponse<Void> {
    }
}
