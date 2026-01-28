# JavaRPG

## Installation
### Dépendances
- Java version : ``25.0.1``
- JVM runner : ``Eclipse Temurin``
- Build tool : ``Maven``

### Lancer le projet (dev)
1. Cloner le repo : <url> repo
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