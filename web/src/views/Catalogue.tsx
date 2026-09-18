import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ItemList } from "../components/ItemList";
import { Loader } from "../components/Loader";
import { Pagination } from "../components/Pagination";
import { Search } from "../components/Search";
import { useDebounce } from "../hooks/useDebounce";
import { mockItems } from "../data/mockItems";
import type { Item } from "../types/api";

const ITEMS_PER_PAGE = 4;

const categories = [
  { value: "", label: "Toutes les catégories" },
  { value: "revolver", label: "Revolvers" },
  { value: "pistolet", label: "Pistolets" },
  { value: "fusil_militaire", label: "Fusils militaires" },
  { value: "carabine_levier", label: "Carabines à levier" },
] as const;

export function Catalogue(): React.JSX.Element {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const filteredItems = useMemo<Item[]>(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return mockItems.filter((item) => {
      const matchesSearch =
        normalizedSearch === "" ||
        item.titre.toLowerCase().includes(normalizedSearch) ||
        item.fabricant.toLowerCase().includes(normalizedSearch) ||
        item.pays_origine.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "" || item.categorie === category;

      return matchesSearch && matchesCategory;
    });
  }, [debouncedSearch, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  const visibleItems = useMemo<Item[]>(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  function handleSearchChange(value: string): void {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void {
    setCategory(event.target.value);
    setPage(1);
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Catalogue documentaire</p>
        <h1>Armes à feu du XIXe siècle</h1>
        <p>
          Explorez des armes historiques fabriquées entre 1800 et 1899.
        </p>

        <nav className="navigation" aria-label="Navigation">
          <Link to="/">Catalogue</Link>
          <Link to="/collection">Ma collection</Link>
          <Link to="/stats">Statistiques</Link>
          <Link to="/login">Connexion</Link>
        </nav>
      </header>

      <section className="filters" aria-label="Recherche et filtre">
        <Search value={search} onChange={handleSearchChange} />

        <label>
          Catégorie
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

      {!isLoading && filteredItems.length === 0 ? (
        <EmptyState message="Aucune arme ne correspond à votre recherche." />
      ) : null}

      {!isLoading && filteredItems.length > 0 ? (
        <>
          <p className="results-count">
            {filteredItems.length} résultat
            {filteredItems.length > 1 ? "s" : ""}
          </p>

          <ItemList items={visibleItems} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </main>
  );
}