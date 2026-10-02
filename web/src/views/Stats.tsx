import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";
import { useCollection } from "../context/useCollection";
import { useAuth } from "../context/useAuth";

const statusLabels = [
  { key: "a_decouvrir", label: "À découvrir" },
  { key: "en_cours", label: "En cours" },
  { key: "termine", label: "Terminés" },
] as const;

export function Stats(): React.JSX.Element {
  const { token } = useAuth();
  const { stats, isStatsLoading, statsError, loadStats } = useCollection();

  useEffect(() => {
    if (token !== null) void loadStats();
  }, [token, loadStats]);

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
      {isStatsLoading ? <Loader message="Chargement des statistiques..." /> : null}
      {!isStatsLoading && statsError !== null ? <ErrorState message={statsError} /> : null}
      {!isStatsLoading && statsError === null && stats !== null ? (
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
            <strong>{stats.note_moyenne === null ? "—" : `${stats.note_moyenne.toFixed(1)}/5`}</strong>
          </article>
        </section>
      ) : null}
    </main>
  );
}