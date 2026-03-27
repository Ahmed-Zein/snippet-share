import { createContext, useMemo, useState } from "react";
import AppStorage from "../common/storage";
import StorageKey from "../common/storageKey";
import type User from "../models/user";
import { AuthService } from "./AuthService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(
        AppStorage.get(StorageKey.USER_DATA) || "null",
      ) as User | null;
    } catch {
      return null;
    }
  });
  const authService = useMemo(() => new AuthService(), []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = await authService.login(email, password);
    setUser(user);
    return !!user;
  };

  const logout = () => {
    setUser(null);
    AppStorage.remove(StorageKey.USER_DATA);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
