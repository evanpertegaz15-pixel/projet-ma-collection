import { createContext } from "react";
import type { LoginPayload, User } from "../types/api";

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);