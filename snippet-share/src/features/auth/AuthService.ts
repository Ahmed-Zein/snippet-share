import apiClient from "../common/apiClient";
import AppStorage from "../common/storage";
import StorageKey from "../common/storageKey";
import type User from "../models/user";
import type AuthResponse from "./AuthResponse";

export class AuthService {
  async login(email: string, password: string): Promise<User> {
    const data = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }
    const { token, user } = data.data;
    AppStorage.set(StorageKey.AUTH_TOKEN, token);
    AppStorage.set(StorageKey.USER_DATA, JSON.stringify(user));

    return data.data.user;
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    const data = await apiClient.post<AuthResponse>("/auth/singup", {
      name,
      email,
      password,
    });
    if (!data.success) {
      throw new Error(data.message || "Signup failed");
    }
    const { token, user } = data.data;
    AppStorage.set(StorageKey.AUTH_TOKEN, token);
    AppStorage.set(StorageKey.USER_DATA, JSON.stringify(user));

    return data.data.user;
  }

  async logout() {
    AppStorage.remove(StorageKey.AUTH_TOKEN);
    AppStorage.remove(StorageKey.USER_DATA);
  }
}
