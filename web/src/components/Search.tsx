type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function Search({ value, onChange }: SearchProps): React.JSX.Element {
  return (
    <label className="search">
      Rechercher une arme historique
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Exemple : Colt, Chassepot, Winchester..."
      />
    </label>
  );
}