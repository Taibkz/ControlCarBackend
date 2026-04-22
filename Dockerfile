# Etapa 1: Construcción (Build)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compilamos saltándonos los tests para que el despliegue sea más rápido
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución (Run)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copiamos el .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar
# Exponemos el puerto de Spring Boot
EXPOSE 8080
# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
