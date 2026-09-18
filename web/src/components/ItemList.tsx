import type { Item } from "../types/api";
import { ItemCard } from "./ItemCard";

type ItemListProps = {
  items: Item[];
};

export function ItemList({ items }: ItemListProps): React.JSX.Element {
  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}