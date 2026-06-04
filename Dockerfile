# Phase de build
FROM eclipse-temurin:25 AS builder
ENV APP_HOME=/usr/jrpg
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
ADD ./backend $APP_HOME
RUN ./mvnw -f $APP_HOME/pom.xml clean package

# Phase d'exécution
FROM eclipse-temurin:25-jre
ARG JAR_FILE=/usr/jrpg/target/*.jar
COPY --from=builder $JAR_FILE /app/runner.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/runner.jar"]
