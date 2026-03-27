import apiClient from "../common/apiClient";
import type ApiResponse from "../common/apiResponse";
import AppStorage from "../common/storage";
import StorageKey from "../common/storageKey";
import type User from "../models/user";
import type AuthResponse from "./AuthResponse";

export class AuthService {
  async login(email: string, password: string): Promise<User> {
    const res = apiClient.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    });
    const data = await res;
    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }
    const { token, user } = data.data;
    AppStorage.set(StorageKey.AUTH_TOKEN, token);
    AppStorage.set(StorageKey.USER_DATA, JSON.stringify(user));

    return data.data.user;
  }
}
