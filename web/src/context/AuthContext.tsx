import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthTypes";
import { fetchCurrentUser, loginUser } from "../services/http";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { LoginPayload, User } from "../types/api";

const TOKEN_KEY = "collection_access_token";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [token, setToken] = useLocalStorage<string | null>(TOKEN_KEY, null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() =>
    token !== null,
  );

  useEffect(() => {
    if (token === null) return;
    let active = true;
    fetchCurrentUser(token)
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
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
  }, [token, setToken]);

  async function signIn(payload: LoginPayload): Promise<void> {
    const authToken = await loginUser(payload);
    const currentUser = await fetchCurrentUser(authToken.access_token);
    setUser(currentUser);
    setToken(authToken.access_token);
  }

  function signOut(): void {
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