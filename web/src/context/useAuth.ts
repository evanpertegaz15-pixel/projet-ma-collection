import { useContext } from "react";
import { AuthContext } from "./AuthTypes";
import type { AuthContextValue } from "./AuthTypes";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }
  return context;
}