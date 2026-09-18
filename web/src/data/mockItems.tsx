import type { Item } from "../types/api";

export const mockItems: Item[] = [
  {
    id: 1,
    titre: "Colt Single Action Army",
    categorie: "revolver",
    description:
      "Revolver américain historique introduit en 1873, connu pour son rôle dans la conquête de l’Ouest.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Colt_Single_Action_Army.jpg/640px-Colt_Single_Action_Army.jpg",
    annee: 1873,
    fabricant: "Colt",
    pays_origine: "États-Unis",
  },
  {
    id: 2,
    titre: "Winchester Model 1873",
    categorie: "carabine_levier",
    description:
      "Carabine à levier historique fabriquée aux États-Unis au XIXe siècle.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Winchester_Model_1873.jpg/640px-Winchester_Model_1873.jpg",
    annee: 1873,
    fabricant: "Winchester Repeating Arms Company",
    pays_origine: "États-Unis",
  },
  {
    id: 3,
    titre: "Fusil Chassepot modèle 1866",
    categorie: "fusil_militaire",
    description:
      "Fusil français à chargement par la culasse, adopté par l’armée française en 1866.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Chassepot_rifle.jpg/640px-Chassepot_rifle.jpg",
    annee: 1866,
    fabricant: "Manufactures impériales françaises",
    pays_origine: "France",
  },
  {
    id: 4,
    titre: "Remington New Model Army",
    categorie: "revolver",
    description:
      "Revolver à percussion américain, produit durant la seconde moitié du XIXe siècle.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Remington_New_Model_Army.jpg/640px-Remington_New_Model_Army.jpg",
    annee: 1863,
    fabricant: "E. Remington and Sons",
    pays_origine: "États-Unis",
  },
  {
    id: 5,
    titre: "Martini-Henry",
    categorie: "fusil_militaire",
    description:
      "Fusil militaire britannique à un coup utilisé à la fin du XIXe siècle.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Martini-Henry_rifle.jpg/640px-Martini-Henry_rifle.jpg",
    annee: 1871,
    fabricant: "Royal Small Arms Factory",
    pays_origine: "Royaume-Uni",
  },
  {
    id: 6,
    titre: "Smith & Wesson Model 3",
    categorie: "revolver",
    description:
      "Revolver américain à brisure produit à partir de la seconde moitié du XIXe siècle.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Smith_and_Wesson_Model_3.jpg/640px-Smith_and_Wesson_Model_3.jpg",
    annee: 1870,
    fabricant: "Smith & Wesson",
    pays_origine: "États-Unis",
  },
];