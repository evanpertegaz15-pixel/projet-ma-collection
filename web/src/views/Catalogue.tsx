import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { ItemList } from "../components/ItemList";
import { Loader } from "../components/Loader";
import { Pagination } from "../components/Pagination";
import { Search } from "../components/Search";
import { useDebounce } from "../hooks/useDebounce";
import { fetchItems } from "../services/http";
import type { Item } from "../types/api";

const ITEMS_PER_PAGE = 4;

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
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
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
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setCategory(event.target.value);
    setPage(1);
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
          <Link to="/login">Connexion</Link>
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
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
        </>
      ) : null}
    </main>
  );
}