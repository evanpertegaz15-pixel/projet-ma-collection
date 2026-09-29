import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";
import { useAuth } from "../context/useAuth";
import { fetchStats } from "../services/http";
import type { Stats as CollectionStats } from "../types/api";

const statusLabels = [
  { key: "a_decouvrir", label: "À découvrir" },
  { key: "en_cours", label: "En cours" },
  { key: "termine", label: "Terminés" },
] as const;

export function Stats(): React.JSX.Element {
  const { token } = useAuth();
  const [result, setResult] = useState<{
    token: string;
    stats: CollectionStats | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (token === null) return;
    const controller = new AbortController();
    fetchStats(token, controller.signal)
      .then((stats) => setResult({ token, stats, error: null }))
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setResult({
          token,
          stats: null,
          error: requestError instanceof Error ? requestError.message : "Impossible de charger les statistiques.",
        });
      });
    return () => controller.abort();
  }, [token]);

  const currentResult = result?.token === token ? result : null;
  const stats = currentResult?.stats ?? null;
  const error = currentResult?.error ?? null;
  const isLoading = token !== null && currentResult === null;

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Espace personnel</p>
        <h1>Statistiques</h1>
        <nav className="navigation" aria-label="Navigation">
          <Link to="/">Catalogue</Link>
          <Link to="/collection">Ma collection</Link>
        </nav>
      </header>
      {isLoading ? <Loader message="Chargement des statistiques..." /> : null}
      {!isLoading && error !== null ? <ErrorState message={error} /> : null}
      {!isLoading && error === null && stats !== null ? (
        <section className="item-grid stats-grid" aria-label="Statistiques de la collection">
          <article className="item-card item-card__content">
            <span className="eyebrow">Objets</span>
            <strong>{stats.total}</strong>
          </article>
          {statusLabels.map(({ key, label }) => (
            <article className="item-card item-card__content" key={key}>
              <span>{label}</span>
              <strong>{stats.par_statut[key] ?? 0}</strong>
            </article>
          ))}
          <article className="item-card item-card__content">
            <span>Note moyenne</span>
            <strong>{stats.note_moyenne === null ? "—" : stats.note_moyenne.toFixed(1)}</strong>
          </article>
        </section>
      ) : null}
    </main>
  );
}