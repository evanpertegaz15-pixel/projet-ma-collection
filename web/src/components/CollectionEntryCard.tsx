import { useState } from "react";
import { Link } from "react-router-dom";
import { ImageLightbox } from "./ImageLightbox";
import { ErrorState } from "./ErrorState";
import { resolveItemImage } from "../services/http";
import type { CollectionEntry, Statut, UpdateCollectionEntry } from "../types/api";

type CollectionEntryCardProps = {
  entry: CollectionEntry;
  onSave: (id: number, payload: UpdateCollectionEntry) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const statuses: { value: Statut; label: string }[] = [
  { value: "a_decouvrir", label: "À découvrir" },
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminé" },
];

export function CollectionEntryCard({entry, onSave, onDelete,}: CollectionEntryCardProps): React.JSX.Element {
  const [statut, setStatut] = useState<Statut>(entry.statut);
  const [note, setNote] = useState<string>(entry.note?.toString() ?? "");
  const [commentaire, setCommentaire] = useState<string>(entry.commentaire ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  async function save(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsBusy(true);
    setMessage(null);
    setHasError(false);
    const payload: UpdateCollectionEntry = {
      statut,
      note: note.trim() === "" ? null : Number(note),
      commentaire: commentaire.trim() || null,
    };
    try {
      await onSave(entry.id, payload);
      setMessage("Modifications enregistrées.");
    } catch (error: unknown) {
      setHasError(true);
      setMessage(error instanceof Error ? error.message : "Échec de la mise à jour.");
    } finally {
      setIsBusy(false);
    }
  }

  async function remove(): Promise<void> {
    setIsBusy(true);
    setMessage(null);
    setHasError(false);
    try {
      await onDelete(entry.id);
    } catch (error: unknown) {
      setHasError(true);
      setMessage(error instanceof Error ? error.message : "Échec de la suppression.");
      setIsBusy(false);
    }
  }

  return (
    <article className="item-card">
      <ImageLightbox className="item-card__image" src={resolveItemImage(entry.item.image_url)} alt={`Illustration de ${entry.item.name}`} />
      <div className="item-card__content">
        <span className="tag">{entry.item.categorie}</span>
        <h2><Link to={`/items/${entry.item.id}`}>{entry.item.name}</Link></h2>
        <p>Ajouté le {new Date(entry.date_ajout).toLocaleDateString("fr-FR")}</p>
        <div className="entry-rating">
          <span className="entry-rating__label">Votre note</span>
          <strong>{entry.note === null ? "Non noté" : `${entry.note}/5`}</strong>
        </div>
        <section className="entry-comment" aria-label="Commentaire enregistré">
          <h3>Commentaire</h3>
          <p>{entry.commentaire?.trim() || "Aucun commentaire."}</p>
        </section>
        <form className="entry-form" onSubmit={save}>
          <label>
            Statut
            <select value={statut} onChange={(event) => setStatut(event.target.value as Statut)}>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </label>
          <label className="entry-form__note">Modifier la note
            <span className="entry-form__note-control">
              <input type="number" min="1" max="5" value={note} onChange={(event) => setNote(event.target.value)} aria-label="Note sur 5"/>
              <span aria-hidden="true">/5</span>
            </span>
          </label>
          <label>Modifier le commentaire
            <textarea maxLength={200} value={commentaire} onChange={(event) => setCommentaire(event.target.value)} rows={3}/>
          </label>
          <div className="entry-form__actions">
            <button type="submit" disabled={isBusy}>Enregistrer</button>
            <button type="button" disabled={isBusy} onClick={remove}>Supprimer</button>
          </div>
          {message !== null
            ? hasError
              ? <ErrorState message={message} />
              : <p className="state-message">{message}</p>
            : null}
        </form>
      </div>
    </article>
  );
}