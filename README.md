# JavaRPG
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
