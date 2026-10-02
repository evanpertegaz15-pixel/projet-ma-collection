import { createContext } from "react";
import type {
  CollectionEntry,
  CreateCollectionEntry,
  Stats,
  UpdateCollectionEntry,
} from "../types/api";

export type CollectionContextValue = {
  entries: CollectionEntry[];
  isLoading: boolean;
  error: string | null;
  saveEntry: (id: number, payload: UpdateCollectionEntry) => Promise<void>;
  removeEntry: (id: number) => Promise<void>;
  addEntry: (payload: CreateCollectionEntry) => Promise<CollectionEntry>;
  stats: Stats | null;
  isStatsLoading: boolean;
  statsError: string | null;
  loadStats: () => Promise<void>;
};

export const CollectionContext = createContext<CollectionContextValue | undefined>(undefined);
