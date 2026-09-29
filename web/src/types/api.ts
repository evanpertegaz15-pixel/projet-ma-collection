export type Statut = "a_decouvrir" | "en_cours" | "termine";

export type User = {
  id: number;
  email: string;
};

export type AuthToken = {
  access_token: string;
  token_type: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  confirm_password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type Item = {
  id: number;
  name: string;
  categorie: "artillery" | "explosive" | "firearm" | "melee" | "naval" | "support";
  description: string;
  image_url: string;
  year: number;
  item_range: number;
};

export type PaginatedItems = {
  total: number;
  page: number;
  limit: number;
  results: Item[];
};

export type CollectionEntry = {
  id: number;
  statut: Statut;
  note: number | null;
  commentaire: string | null;
  date_ajout: string;
  item: Item;
};

export type CreateCollectionEntry = {
  item_id: number;
  statut: Statut;
  note?: number;
  commentaire?: string;
};

export type UpdateCollectionEntry = {
  statut?: Statut;
  note?: number | null;
  commentaire?: string | null;
};

export type Stats = {
  total: number;
  par_statut: Partial<Record<Statut, number>>;
  note_moyenne: number | null;
};

export type ApiError = {
  code: number;
  message: string;
};

export type ApiErrorResponse = {
  erreur: ApiError;
};