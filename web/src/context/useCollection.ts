import { useContext } from "react";
import { CollectionContext } from "./CollectionTypes";
import type { CollectionContextValue } from "./CollectionTypes";

export function useCollection(): CollectionContextValue {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection doit être utilisé dans CollectionProvider.");
  }
  return context;
}
