import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImageLightbox } from "../components/ImageLightbox";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";
import { useCollection } from "../context/useCollection";
import { ApiClientError, fetchItem, resolveItemImage } from "../services/http";
import type { Item } from "../types/api";
import { useAuth } from "../context/useAuth";

export function ItemDetail(): React.JSX.Element {
  const { itemId } = useParams<{ itemId: string }>();
  const location = useLocation();
  const { token, user } = useAuth();
  const { addEntry } = useCollection();
  const previousLocation = (location.state as { from?: unknown } | null)?.from;
  const catalogueUrl =
    typeof previousLocation === "string" &&
    previousLocation.startsWith("/") &&
    !previousLocation.startsWith("//")
      ? previousLocation
      : "/";
  const id = Number(itemId);
  const [itemResult, setItemResult] = useState<{
    id: number;
    item: Item | null;
    error: string | null;
    notFound: boolean;
  } | null>(null);
  const [collectionMessage, setCollectionMessage] = useState<string | null>(null);
  const [collectionError, setCollectionError] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const invalidId = !Number.isInteger(id) || id < 1;
  const currentResult = itemResult?.id === id ? itemResult : null;
  const isLoading = !invalidId && currentResult === null;
  const error = invalidId
    ? null
    : currentResult?.error ?? null;
  const notFound = invalidId || currentResult?.notFound === true;
  const item = currentResult?.item ?? null;

  async function addToCollection(): Promise<void> {
    if (token === null || item === null) return;
    setIsAdding(true);
    setCollectionMessage(null);
    setCollectionError(false);
    try {
      await addEntry({ item_id: item.id, statut: "a_decouvrir" });
      setCollectionMessage("Objet ajouté à votre collection.");
    } catch (requestError: unknown) {
      setCollectionError(true);
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
      .then((loadedItem) =>
        setItemResult({ id, item: loadedItem, error: null, notFound: false }),
      )
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
          notFound: requestError instanceof ApiClientError && requestError.status === 404,
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

  if (notFound) {
    return (
      <main className="page">
        <EmptyState message="Objet introuvable." />
        <Link to={catalogueUrl}>Retour au catalogue</Link>
      </main>
    );
  }

  if (error !== null || item === null) {
    return (
      <main className="page">
        <ErrorState message={error ?? "Objet introuvable."} />
        <Link to={catalogueUrl}>Retour au catalogue</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to={catalogueUrl}>← Retour au catalogue</Link>
      <article className="item-detail">
        <ImageLightbox className="item-detail__image" src={resolveItemImage(item.image_url)} alt={`Illustration historique de ${item.name}`} />
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
          {collectionMessage !== null
            ? collectionError
              ? <ErrorState message={collectionMessage} />
              : <p className="state-message">{collectionMessage}</p>
            : null}
        </div>
      </article>
    </main>
  );
}