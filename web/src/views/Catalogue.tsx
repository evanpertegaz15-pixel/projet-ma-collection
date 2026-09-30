import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { ItemList } from "../components/ItemList";
import { Loader } from "../components/Loader";
import { Pagination } from "../components/Pagination";
import { Search } from "../components/Search";
import { useAuth } from "../context/useAuth";
import { useDebounce } from "../hooks/useDebounce";
import { fetchItems } from "../services/http";
import type { Item } from "../types/api";

const ITEMS_PER_PAGE = 6;

const categories = [
  { value: "", label: "Toutes les catégories" },
  { value: "artillery", label: "Artillerie" },
  { value: "explosive", label: "Explosifs" },
  { value: "firearm", label: "Armes à feu" },
  { value: "melee", label: "Armes de mêlée" },
  { value: "naval", label: "Armes navales" },
  { value: "support", label: "Équipement de soutien" },
] as const;

export function Catalogue(): React.JSX.Element {
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const category = searchParams.get("categorie") ?? "";
  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const [result, setResult] = useState<{
    key: string;
    items: Item[];
    total: number;
    error: string | null;
  } | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const requestKey = JSON.stringify([debouncedSearch, category, page]);

  useEffect(() => {
    const controller = new AbortController();
    fetchItems(
      {
        q: debouncedSearch.trim(),
        categorie: category,
        page,
        limit: ITEMS_PER_PAGE,
      },
      controller.signal,
    )
      .then((response) => {
        setResult({
          key: requestKey,
          items: response.results,
          total: response.total,
          error: null,
        });
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setResult({
          key: requestKey,
          items: [],
          total: 0,
          error:
            requestError instanceof Error
              ? requestError.message
              : "Impossible de charger le catalogue.",
        });
      });
    return () => controller.abort();
  }, [debouncedSearch, category, page, requestKey]);

  const currentResult = result?.key === requestKey ? result : null;
  const isLoading = currentResult === null;
  const items = currentResult?.items ?? [];
  const total = currentResult?.total ?? 0;
  const error = currentResult?.error ?? null;
  const totalPages = Math.max(
    1,
    Math.ceil(total / ITEMS_PER_PAGE),
  );

  function handleSearchChange(value: string): void {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("q", value);
    else nextParams.delete("q");
    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const nextParams = new URLSearchParams(searchParams);
    if (event.target.value) nextParams.set("categorie", event.target.value);
    else nextParams.delete("categorie");
    nextParams.delete("page");
    setSearchParams(nextParams);
  }

  function handlePageChange(nextPage: number): void {
    const nextParams = new URLSearchParams(searchParams);
    if (nextPage > 1) nextParams.set("page", String(nextPage));
    else nextParams.delete("page");
    setSearchParams(nextParams);
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Catalogue documentaire</p>
        <h1>Objets historiques du XIXe siècle</h1>
        <p>Explorez les objets enregistrés dans le catalogue.</p>
        <nav className="navigation" aria-label="Navigation">
          <Link to="/">Catalogue</Link>
          <Link to="/collection">Ma collection</Link>
          <Link to="/stats">Statistiques</Link>
          {isAuthLoading ? null : user !== null ? (
            <button type="button" onClick={signOut}>Déconnexion</button>
          ) : (
            <Link to="/login">Connexion</Link>
          )}
        </nav>
      </header>
      <section className="filters" aria-label="Recherche et filtre">
        <Search value={search} onChange={handleSearchChange} />
        <label>Catégorie
          <select value={category} onChange={handleCategoryChange}>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </section>
      {isLoading ? <Loader message="Chargement du catalogue..." /> : null}
      {!isLoading && error !== null ? <ErrorState message={error} /> : null}
      {!isLoading && error === null && total === 0 ? (
        <EmptyState message="Aucun objet ne correspond à votre recherche." />
      ) : null}
      {!isLoading && error === null && total > 0 ? (
        <>
          <p className="results-count">
            {total} résultat{total > 1 ? "s" : ""}
          </p>
          <ItemList items={items} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange}/>
        </>
      ) : null}
    </main>
  );
}