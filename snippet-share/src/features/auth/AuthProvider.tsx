import { createContext, useMemo, useState } from "react";
import AppStorage from "../common/storage";
import StorageKey from "../common/storageKey";
import type User from "../models/user";
import { AuthService } from "./AuthService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
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
    try {
      const user = await authService.login(email, password);
      setUser(user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const user = await authService.signup(name, email, password);
      setUser(user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
