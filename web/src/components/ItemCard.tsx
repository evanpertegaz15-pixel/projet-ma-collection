import { Link } from "react-router-dom";
import { resolveItemImage } from "../services/http";
import type { Item } from "../types/api";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps): React.JSX.Element {
  return (
    <article className="item-card">
      <img className="item-card__image" src={resolveItemImage(item.image_url)} alt={`Illustration historique de ${item.name}`}/>
      <div className="item-card__content">
        <span className="tag">{item.categorie}</span>
        <h2>{item.name}</h2>
        <p>Année : {item.year}</p>
        <p>Portée : {item.item_range} m</p>
        <Link to={`/items/${item.id}`}>Voir la fiche</Link>
      </div>
    </article>
  );
}