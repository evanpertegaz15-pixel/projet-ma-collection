import { Link, useParams } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { mockItems } from "../data/mockItems";

export function ItemDetail(): React.JSX.Element {
  const { itemId } = useParams<{ itemId: string }>();
  const id = Number(itemId);

  const item = mockItems.find((currentItem) => currentItem.id === id);

  if (item === undefined) {
    return (
      <main className="page">
        <ErrorState message="Arme historique introuvable." />
        <Link to="/">Retour au catalogue</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/">← Retour au catalogue</Link>

      <article className="item-detail">
        <img
          src={item.image_url}
          alt={`Illustration historique de ${item.titre}`}
        />

        <div>
          <span className="tag">{item.categorie}</span>
          <h1>{item.titre}</h1>
          <p>{item.description}</p>

          <dl className="details-list">
            <div>
              <dt>Année</dt>
              <dd>{item.annee}</dd>
            </div>
            <div>
              <dt>Fabricant</dt>
              <dd>{item.fabricant}</dd>
            </div>
            <div>
              <dt>Pays d’origine</dt>
              <dd>{item.pays_origine}</dd>
            </div>
          </dl>

          <Link to="/login">Se connecter pour ajouter à ma collection</Link>
        </div>
      </article>
    </main>
  );
}