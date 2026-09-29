import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";
import { addCollectionEntry, fetchItem, resolveItemImage } from "../services/http";
import type { Item } from "../types/api";
import { useAuth } from "../context/useAuth";

export function ItemDetail(): React.JSX.Element {
  const { itemId } = useParams<{ itemId: string }>();
  const { token, user } = useAuth();
  const id = Number(itemId);
  const [itemResult, setItemResult] = useState<{
    id: number;
    item: Item | null;
    error: string | null;
  } | null>(null);
  const [collectionMessage, setCollectionMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const invalidId = !Number.isInteger(id) || id < 1;
  const currentResult = itemResult?.id === id ? itemResult : null;
  const isLoading = !invalidId && currentResult === null;
  const error = invalidId
    ? "Arme historique introuvable."
    : currentResult?.error ?? null;
  const item = currentResult?.item ?? null;

  async function addToCollection(): Promise<void> {
    if (token === null || item === null) return;
    setIsAdding(true);
    setCollectionMessage(null);
    try {
      await addCollectionEntry({ item_id: item.id, statut: "a_decouvrir" }, token);
      setCollectionMessage("Objet ajouté à votre collection.");
    } catch (requestError: unknown) {
      setCollectionMessage(
        requestError instanceof Error ? requestError.message : "Impossible d’ajouter cet objet.",
      );
    } finally {
      setIsAdding(false);
    }
  }

  useEffect(() => {
    if (invalidId) return;
    const controller = new AbortController();
    fetchItem(id, controller.signal)
      .then((loadedItem) => setItemResult({ id, item: loadedItem, error: null }))
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setItemResult({
          id,
          item: null,
          error:
            requestError instanceof Error
              ? requestError.message
              : "Impossible de charger cette fiche.",
        });
      });
    return () => controller.abort();
  }, [id, invalidId]);

  if (isLoading) {
    return (
      <main className="page">
        <Loader message="Chargement de la fiche..." />
      </main>
    );
  }

  if (error !== null || item === null) {
    return (
      <main className="page">
        <ErrorState message={error ?? "Arme historique introuvable."} />
        <Link to="/">Retour au catalogue</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/">← Retour au catalogue</Link>
      <article className="item-detail">
        <img src={resolveItemImage(item.image_url)} alt={`Illustration historique de ${item.name}`}/>
        <div>
          <span className="tag">{item.categorie}</span>
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <dl className="details-list">
            <div>
              <dt>Année</dt>
              <dd>{item.year}</dd>
            </div>
            <div>
              <dt>Portée</dt>
              <dd>{item.item_range} m</dd>
            </div>
          </dl>
          {user !== null ? (
            <button type="button" onClick={addToCollection} disabled={isAdding}>
              {isAdding ? "Ajout en cours..." : "Ajouter à ma collection"}
            </button>
          ) : (
            <Link to="/login">Se connecter pour ajouter à ma collection</Link>
          )}
          {collectionMessage !== null ? (
            <p className="state-message">{collectionMessage}</p>
          ) : null}
        </div>
      </article>
    </main>
  );
}