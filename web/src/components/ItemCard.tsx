import { Link } from "react-router-dom";
import type { Item } from "../types/api";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps): React.JSX.Element {
  return (
    <article className="item-card">
      <img
        className="item-card__image"
        src={item.image_url}
        alt={`Illustration historique de ${item.titre}`}
      />

      <div className="item-card__content">
        <span className="tag">{item.categorie}</span>
        <h2>{item.titre}</h2>
        <p>
          {item.fabricant} · {item.pays_origine}
        </p>
        <p>Année : {item.annee}</p>

        <Link to={`/items/${item.id}`}>Voir la fiche</Link>
      </div>
    </article>
  );
}