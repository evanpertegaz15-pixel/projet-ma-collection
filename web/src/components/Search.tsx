type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function Search({ value, onChange }: SearchProps): React.JSX.Element {
  return (
    <label className="search">
      Rechercher un objet historique
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Exemple : mortier, Lebel, sabre..."/>
    </label>
  );
}