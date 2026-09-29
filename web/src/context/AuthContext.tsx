import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthTypes";
import { fetchCurrentUser, loginUser } from "../services/http";
import type { LoginPayload, User } from "../types/api";

const TOKEN_KEY = "collection_access_token";

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() =>
    Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  useEffect(() => {
    if (token === null) return;
    let active = true;
    fetchCurrentUser(token)
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        if (active) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function signIn(payload: LoginPayload): Promise<void> {
    const authToken = await loginUser(payload);
    const currentUser = await fetchCurrentUser(authToken.access_token);
    localStorage.setItem(TOKEN_KEY, authToken.access_token);
    setUser(currentUser);
    setToken(authToken.access_token);
  }

  function signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}