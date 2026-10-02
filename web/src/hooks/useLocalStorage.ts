import { useCallback, useState } from "react";

export function useLocalStorage<T>(cle: string, valeurInitiale: T): [T, (v: T) => void] {
  const [valeur, setValeur] = useState<T>(() => {
    const valeurStockee = window.localStorage.getItem(cle);
    if (valeurStockee === null) return valeurInitiale;
    try {
      return JSON.parse(valeurStockee) as T;
    } catch {
      if (typeof valeurInitiale === "string") {
        return valeurStockee as T;
      }
      return valeurInitiale;
    }
  });

  const sauvegarder = useCallback((nouvelleValeur: T): void => {
    setValeur(nouvelleValeur);
    if (nouvelleValeur === null) {
      window.localStorage.removeItem(cle);
      return;
    }
    window.localStorage.setItem(cle, JSON.stringify(nouvelleValeur));
  }, [cle]);
  
  return [valeur, sauvegarder];
}
