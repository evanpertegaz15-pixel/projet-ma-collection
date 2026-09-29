import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CollectionEntryCard } from "../components/CollectionEntryCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";
import { useAuth } from "../context/useAuth";
import {
  deleteCollectionEntry,
  fetchCollection,
  updateCollectionEntry,
} from "../services/http";
import type { CollectionEntry, UpdateCollectionEntry } from "../types/api";

export function Collection(): React.JSX.Element {
  const { token, signOut, user } = useAuth();
  const [result, setResult] = useState<{
    token: string;
    entries: CollectionEntry[];
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (token === null) return;
    const controller = new AbortController();
    fetchCollection(token, controller.signal)
      .then((entries) => setResult({ token, entries, error: null }))
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setResult({
          token,
          entries: [],
          error: requestError instanceof Error ? requestError.message : "Impossible de charger la collection.",
        });
      });
    return () => controller.abort();
  }, [token]);

  const currentResult = result?.token === token ? result : null;
  const entries = currentResult?.entries ?? [];
  const error = currentResult?.error ?? null;
  const isLoading = token !== null && currentResult === null;

  async function saveEntry(id: number, payload: UpdateCollectionEntry): Promise<void> {
    if (token === null) return;
    const updated = await updateCollectionEntry(id, payload, token);
    setResult((current) => current?.token === token
      ? { ...current, entries: current.entries.map((entry) => entry.id === id ? updated : entry) }
      : current);
  }

  async function removeEntry(id: number): Promise<void> {
    if (token === null) return;
    await deleteCollectionEntry(id, token);
    setResult((current) => current?.token === token
      ? { ...current, entries: current.entries.filter((entry) => entry.id !== id) }
      : current);
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Espace personnel</p>
        <h1>Ma collection</h1>
        <p>{user?.email}</p>
        <nav className="navigation" aria-label="Navigation">
          <Link to="/">Catalogue</Link>
          <Link to="/stats">Statistiques</Link>
          <button type="button" onClick={signOut}>Déconnexion</button>
        </nav>
      </header>
      {isLoading ? <Loader message="Chargement de votre collection..." /> : null}
      {!isLoading && error !== null ? <ErrorState message={error} /> : null}
      {!isLoading && error === null && entries.length === 0 ? (
        <EmptyState message="Votre collection est encore vide." />
      ) : null}
      {!isLoading && error === null && entries.length > 0 ? (
        <section className="item-grid" aria-label="Objets de ma collection">
          {entries.map((entry) => (
            <CollectionEntryCard key={entry.id} entry={entry} onSave={saveEntry} onDelete={removeEntry}/>
          ))}
        </section>
      ) : null}
    </main>
  );
}