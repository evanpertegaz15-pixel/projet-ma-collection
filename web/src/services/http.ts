import type {
  AuthToken,
  CollectionEntry,
  CreateCollectionEntry,
  Item,
  LoginPayload,
  PaginatedItems,
  RegisterPayload,
  Stats,
  UpdateCollectionEntry,
  User,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type ItemQuery = {
  q?: string;
  categorie?: string;
  page: number;
  limit: number;
};

const localItemImages = import.meta.glob<string>("../assets/items/**/*", {
  eager: true,
  import: "default",
  query: "?url",
});

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
  if (!response.ok) {
    let message = `Erreur API (${response.status})`;
    try {
      const body: { detail?: string; erreur?: { message?: string } } =
        await response.json();
      message = body.detail ?? body.erreur?.message ?? message;
    } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function fetchItems(query: ItemQuery, signal?: AbortSignal,): Promise<PaginatedItems> {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });
  if (query.q) params.set("q", query.q);
  if (query.categorie) params.set("categorie", query.categorie);
  return request<PaginatedItems>(`/items?${params}`, { signal });
}

export function fetchItem(id: number, signal?: AbortSignal): Promise<Item> {
  return request<Item>(`/items/${id}`, { signal });
}

export function registerUser(payload: RegisterPayload): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload): Promise<AuthToken> {
  return request<AuthToken>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchCurrentUser(token: string): Promise<User> {
  return request<User>("/auth/me", {}, token);
}

export function fetchCollection(token: string, signal?: AbortSignal): Promise<CollectionEntry[]> {
  return request<CollectionEntry[]>("/me/collection", { signal }, token);
}

export function addCollectionEntry(payload: CreateCollectionEntry, token: string): Promise<CollectionEntry> {
  return request<CollectionEntry>(
    "/me/collection",
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}

export function updateCollectionEntry(entryId: number, payload: UpdateCollectionEntry, token: string): Promise<CollectionEntry> {
  return request<CollectionEntry>(
    `/me/collection/${entryId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export function deleteCollectionEntry(entryId: number, token: string): Promise<void> {
  return request<void>(`/me/collection/${entryId}`, { method: "DELETE" }, token);
}

export function fetchStats(token: string, signal?: AbortSignal): Promise<Stats> {
  return request<Stats>("/me/stats", { signal }, token);
}

export function resolveItemImage(imageUrl: string): string {
  if (!imageUrl.startsWith("/assets/items/")) return imageUrl;
  const assetKey = `../${imageUrl.slice(1)}`;
  return localItemImages[assetKey] ?? imageUrl;
}