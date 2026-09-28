# Projet Ma Collection - Armes XIXème siècle

## Pré-requis
- Docker Desktop installé et lancé

## Lancement du site
### Docker
- S'assurer d'être dans le dossier `/api`.
- Exécuter la commande suivante pour démarrer le conteneur :
```powershell
docker compose up -d
```
- Vérifier que le processus est lancé :
```powershell
docker ps
```

### FastAPI
- Pour lancer l'API, exécuter la commande suivante dans le dossier `/api` :
```powershell
uvicorn  main:app --reload --port 8000
```
- L'API devient accessible sur `http://localhost:8000`
- Et la documentation de l'API sur `http://localhost:8000/docs`

### Vite
- Pour lancer le site web, s'assurer d'être dans le dossier `/web`, et exécuter ces commandes :
```powershell
npm install
npm run dev
```
- Le site est ensuite accessible sur `http://localhost:5173`

## Initialiser la base de données

Pour remplir la base de données avec le `seed.py`, exécuter la commande suivante à la racine du projet :
```powershell
.\api\.venv\Scripts\python.exe .\api\seed.py
```

Si l'initialisation est réussie, les messages suivants s'afficheront dans ce même ordre : "Initialisation des tables...", "Peuplement de la base..." et "Base initialisée.".