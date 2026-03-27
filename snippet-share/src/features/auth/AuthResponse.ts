import type User from "../models/user";

export default interface AuthResponse {
  token: string;
  user: User;
}
