import { useState } from "react";
import { Link } from "react-router-dom";
import { CollectionEntryCard } from "../components/CollectionEntryCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";
import { useCollection } from "../context/useCollection";
import { useAuth } from "../context/useAuth";
import type { Statut } from "../types/api";

export function Collection(): React.JSX.Element {
  const { signOut, user } = useAuth();
  const {
    entries,
    isLoading,
    error,
    saveEntry,
    removeEntry,
  } = useCollection();
  const [statusFilter, setStatusFilter] = useState<Statut | "">("");
  const [sortOrder, setSortOrder] = useState<"date_desc" | "date_asc" | "note_desc" | "note_asc">("date_desc");
  const visibleEntries = entries
    .filter((entry) => statusFilter === "" || entry.statut === statusFilter)
    .toSorted((first, second) => {
      if (sortOrder.startsWith("date")) {
        const dateDifference = Date.parse(first.date_ajout) - Date.parse(second.date_ajout);
        return sortOrder === "date_desc" ? -dateDifference : dateDifference;
      }
      if (first.note === null || second.note === null) {
        if (first.note === second.note) return 0;
        return first.note === null ? 1 : -1;
      }
      const noteDifference = first.note - second.note;
      return sortOrder === "note_desc" ? -noteDifference : noteDifference;
    });

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
        <>
          <section className="filters" aria-label="Filtres de la collection">
            <label>
              Statut
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as Statut | "")}>
                <option value="">Tous les statuts</option>
                <option value="a_decouvrir">À découvrir</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </label>
            <label>
              Trier par
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}>
                <option value="date_desc">Date d'ajout (plus récent)</option>
                <option value="date_asc">Date d'ajout (plus ancien)</option>
                <option value="note_desc">Note (meilleure)</option>
                <option value="note_asc">Note (pire)</option>
              </select>
            </label>
          </section>
          {visibleEntries.length > 0 ? (
            <section className="item-grid" aria-label="Objets de ma collection">
              {visibleEntries.map((entry) => (
                <CollectionEntryCard key={entry.id} entry={entry} onSave={saveEntry} onDelete={removeEntry}/>
              ))}
            </section>
          ) : (
            <EmptyState message="Aucun objet ne correspond à ce statut." />
          )}
        </>
      ) : null}
    </main>
  );
}