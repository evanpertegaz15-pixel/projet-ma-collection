import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";
import { CollectionContext } from "./CollectionTypes";
import {
  addCollectionEntry,
  deleteCollectionEntry,
  fetchCollection,
  fetchStats,
  updateCollectionEntry,
} from "../services/http";
import type {
  CollectionEntry,
  CreateCollectionEntry,
  Stats,
  UpdateCollectionEntry,
} from "../types/api";

type CollectionResult = {
  token: string;
  entries: CollectionEntry[];
  error: string | null;
};

type StatsResult = {
  token: string;
  stats: Stats | null;
  error: string | null;
};

type CollectionProviderProps = {
  children: ReactNode;
};

export function CollectionProvider({
  children,
}: CollectionProviderProps): React.JSX.Element {
  const { token } = useAuth();
  const [collectionResult, setCollectionResult] = useState<CollectionResult | null>(null);
  const [statsResult, setStatsResult] = useState<StatsResult | null>(null);
  const statsRequestToken = useRef<string | null>(null);
  const statsRequestId = useRef<number>(0);

  useEffect(() => {
    statsRequestToken.current = null;
    statsRequestId.current += 1;
    if (token === null) return;

    let active = true;
    const controller = new AbortController();
    fetchCollection(token, controller.signal)
      .then((entries) => {
        if (active) setCollectionResult({ token, entries, error: null });
      })
      .catch((requestError: unknown) => {
        if (!active || (requestError instanceof DOMException && requestError.name === "AbortError")) return;
        setCollectionResult({
          token,
          entries: [],
          error: requestError instanceof Error
            ? requestError.message
            : "Impossible de charger la collection.",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [token]);

  const saveEntry = useCallback(async (
    id: number,
    payload: UpdateCollectionEntry,
  ): Promise<void> => {
    if (token === null) throw new Error("Une session valide est nécessaire.");
    const updated = await updateCollectionEntry(id, payload, token);
    setCollectionResult((current) => current?.token === token
      ? {
          ...current,
          entries: current.entries.map((entry) => entry.id === id ? updated : entry),
        }
      : current);
    statsRequestToken.current = null;
    statsRequestId.current += 1;
    setStatsResult(null);
  }, [token]);

  const removeEntry = useCallback(async (id: number): Promise<void> => {
    if (token === null) throw new Error("Une session valide est nécessaire.");
    await deleteCollectionEntry(id, token);
    setCollectionResult((current) => current?.token === token
      ? { ...current, entries: current.entries.filter((entry) => entry.id !== id) }
      : current);
    statsRequestToken.current = null;
    statsRequestId.current += 1;
    setStatsResult(null);
  }, [token]);

  const addEntry = useCallback(async (
    payload: CreateCollectionEntry,
  ): Promise<CollectionEntry> => {
    if (token === null) throw new Error("Une session valide est nécessaire.");
    const added = await addCollectionEntry(payload, token);
    setCollectionResult((current) => current?.token === token
      ? {
          ...current,
          entries: current.entries.some((entry) => entry.id === added.id)
            ? current.entries
            : [...current.entries, added],
        }
      : current);
    statsRequestToken.current = null;
    statsRequestId.current += 1;
    setStatsResult(null);
    return added;
  }, [token]);

  const loadStats = useCallback(async (): Promise<void> => {
    if (token === null) throw new Error("Une session valide est nécessaire.");
    if (statsRequestToken.current === token) return;
    statsRequestToken.current = token;
    const requestId = ++statsRequestId.current;
    try {
      const stats = await fetchStats(token);
      if (requestId === statsRequestId.current) {
        setStatsResult({ token, stats, error: null });
      }
    } catch (requestError: unknown) {
      if (requestId === statsRequestId.current) {
        setStatsResult({
            token,
            stats: null,
            error: requestError instanceof Error
              ? requestError.message
              : "Impossible de charger les statistiques.",
        });
      }
    }
  }, [token]);

  const currentCollection = collectionResult?.token === token ? collectionResult : null;
  const currentStats = statsResult?.token === token ? statsResult : null;

  return (
    <CollectionContext.Provider
      value={{
        entries: currentCollection?.entries ?? [],
        isLoading: token !== null && currentCollection === null,
        error: currentCollection?.error ?? null,
        saveEntry,
        removeEntry,
        addEntry,
        stats: currentStats?.stats ?? null,
        isStatsLoading: token !== null && currentStats === null,
        statsError: currentStats?.error ?? null,
        loadStats,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}