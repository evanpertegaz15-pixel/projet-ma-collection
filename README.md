# Projet Ma Collection - Armes XIXème siècle

## Pré-requis
- Docker Desktop installé et lancé, la commande `docker ps` doit fonctionner.
- Depuis la racine du projet, créer un environnement Python local dans `api` :
```powershell
cd api
python -m venv .venv
```
- Installer les dépendances dans cet environnement :
```powershell
.\.venv\Scripts\python.exe -m pip install -r ..\requirements.txt
```

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
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```
- L'API devient accessible sur `http://localhost:8000`
- Et la documentation de l'API sur `http://localhost:8000/docs`

### Vite
- Pour lancer le site web, depuis un autre terminal, s'assurer d'être dans le dossier `/web`, et exécuter ces commandes :
```powershell
npm install
npm run dev
```
- Le site est ensuite accessible sur `http://localhost:5173`