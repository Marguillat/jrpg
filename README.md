# JavaRPG
## Si tout fonctionne
- API lancée sur le port ``8080``
- Base de données MongoDB atlas connectée
- Frontend lancé sur le port ``3000``
- Documentation api swagger
## Installation
### Lancer le projet
1. Cloner le repo : <url> repo
#### Avec Docker (recommandé)
##### Dépendances
> - Docker avec compose
2. à la racine du projet, lancer la commande pour assembler et ***lancer le projet***
````shell
docker compose up
````
---
#### Sans docker (si la commande du dessus ne fonctionne pas)
##### Dépendances
> - Java version : ``25.0.1``
> - JVM runner : ``Eclipse Temurin``
> - Build tool : ``Maven``

2. Vérifier avec maven
````shell
./mvnw verify
````
3. Packager avec maven
>créer le ```jar``` dans le dossier target
````shell
./mvnw package
````
4. Lancer le jar et l'application
````shell
java -jar target/<nomDuJar>.jar
````
Le service tourne sur le port ``8080`` par défaut.

## Routes
L'ensemble des routes disponibles possèdent une méthode HTTP : OPTIONS qui permet de voir les paramètres à passer afin de travailler avec ces routes

### Ressource : Racine API (Root)
| Méthode | Route | Description | Paramètres / Body |
|---------|-------|-------------|------------------|
| GET | `/` ou `/api` | Liste toutes les routes disponibles | Aucun |
| OPTIONS | `/` ou `/api` | Affiche les métadonnées de la racine API | Aucun |

### Ressource : Personnages (Characters)
| Méthode | Route | Description | Paramètres / Body |
|---------|-------|-------------|--------------|
| GET | `/api/characters` | Récupère tous les personnages | Aucun |
| POST | `/api/characters` | Crée un nouveau personnage | `name` (String), `characterClass` (WARRIOR, MAGE, ROGUE, CLERIC, PALADIN) |
| GET | `/api/characters/{id}` | Récupère un personnage spécifique | `id` (chemin) |
| DELETE | `/api/characters/{id}` | Supprime un personnage | `id` (chemin) |
| OPTIONS | `/api/characters` | Affiche les métadonnées de la ressource | Aucun |

### Ressource : Objets (Items)
| Méthode | Route | Description | Paramètres / Body |
|---------|-------|-------------|--------------|
| GET | `/api/items` | Récupère tous les objets | Aucun |
| POST | `/api/items` | Crée un nouvel objet | `name` (String), `type` (WEAPON, ARMOR, CONSUMABLE, QUEST_ITEM, ACCESSORY), `strengthBonus` (int), `agilityBonus` (int), `intelligenceBonus` (int), `healthBonus` (int), `manaBonus` (int) |
| GET | `/api/items/{id}` | Récupère un objet spécifique | `id` (chemin) |
| POST | `/api/items/{itemId}/equip/{characterId}` | Équipe un objet à un personnage | `itemId` et `characterId` (chemins) |
| OPTIONS | `/api/items` | Affiche les métadonnées de la ressource | Aucun |

### Ressource : Monstres (Monsters)
| Méthode | Route | Description | Paramètres / Body |
|---------|-------|-------------|--------------|
| GET | `/api/monsters` | Récupère tous les monstres | Aucun |
| POST | `/api/monsters` | Crée un nouveau monstre | `name` (String), `level` (int), `stats` (Stats object), `experienceValue` (long) |
| GET | `/api/monsters/{id}` | Récupère un monstre spécifique | `id` (chemin) |
| DELETE | `/api/monsters/{id}` | Supprime un monstre | `id` (chemin) |
| OPTIONS | `/api/monsters` | Affiche les métadonnées de la ressource | Aucun |

### Ressource : Combats (Battles)
| Méthode | Route | Description | Paramètres / Body |
|---------|-------|-------------|--------------|
| POST | `/api/battles/start` | Déclenche un combat automatisé | `characterId` (String), `monsterId` (String) |
| OPTIONS | `/api/battles` | Affiche les métadonnées de la ressource | Aucun |

## Exemples de requêtes CURL

### Racine API

#### Lister toutes les routes disponibles
```bash
curl -X GET http://localhost:8080/
```

Ou altérnativement :
```bash
curl -X GET http://localhost:8080/api
```

#### Obtenir les métadonnées de la racine API
```bash
curl -X OPTIONS http://localhost:8080/
```

### Personnages

#### Créer un personnage
```bash
curl -X POST http://localhost:8080/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arthas",
    "characterClass": "WARRIOR"
  }'
```

#### Récupérer tous les personnages
```bash
curl -X GET http://localhost:8080/api/characters
```

#### Récupérer un personnage spécifique
```bash
curl -X GET http://localhost:8080/api/characters/{id}
```

#### Supprimer un personnage
```bash
curl -X DELETE http://localhost:8080/api/characters/{id}
```

### Objets

#### Créer un objet
```bash
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Épée de feu",
    "type": "WEAPON",
    "strengthBonus": 10,
    "agilityBonus": 0,
    "intelligenceBonus": 0,
    "healthBonus": 0,
    "manaBonus": 5
  }'
```

#### Récupérer tous les objets
```bash
curl -X GET http://localhost:8080/api/items
```

#### Équiper un objet à un personnage
```bash
curl -X POST http://localhost:8080/api/items/{itemId}/equip/{characterId}
```

### Monstres

#### Créer un monstre
```bash
curl -X POST http://localhost:8080/api/monsters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gobelin Chef",
    "level": 5,
    "stats": {
      "strength": 8,
      "agility": 6,
      "intelligence": 3,
      "health": 25,
      "mana": 0
    },
    "experienceValue": 150
  }'
```

#### Récupérer tous les monstres
```bash
curl -X GET http://localhost:8080/api/monsters
```

### Combats

#### Lancer un combat
```bash
curl -X POST http://localhost:8080/api/battles/start \
  -H "Content-Type: application/json" \
  -d '{
    "characterId": "{id_du_personnage}",
    "monsterId": "{id_du_monstre}"
  }'
```

### Métadonnées (OPTIONS)

#### Obtenir les informations de la ressource Characters
```bash
curl -X OPTIONS http://localhost:8080/api/characters
```

#### Obtenir les informations de la ressource Items
```bash
curl -X OPTIONS http://localhost:8080/api/items
```

#### Obtenir les informations de la ressource Monsters
```bash
curl -X OPTIONS http://localhost:8080/api/monsters
```

#### Obtenir les informations de la ressource Battles
```bash
curl -X OPTIONS http://localhost:8080/api/battles
```
