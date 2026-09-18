import { useState } from "react";

export function useLocalStorage<T>(
  cle: string,
  valeurInitiale: T,
): [T, (nouvelleValeur: T) => void] {
  const [valeur, setValeur] = useState<T>(() => {
    const storedValue = window.localStorage.getItem(cle);

    if (storedValue === null) {
      return valeurInitiale;
    }

    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return valeurInitiale;
    }
  });

  function sauvegarder(nouvelleValeur: T): void {
    setValeur(nouvelleValeur);
    window.localStorage.setItem(cle, JSON.stringify(nouvelleValeur));
  }

  return [valeur, sauvegarder];
}