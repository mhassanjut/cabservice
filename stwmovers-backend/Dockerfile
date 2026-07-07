# DOCKER-DISABLED: Container build inactive. Active deployment: mvn package && java -jar target/stwmovers-backend-1.0.0.jar
# Re-enable: rename to Dockerfile and restore docker-compose.yml api/nginx services + CI docker job.
#
# FROM eclipse-temurin:21-jdk-alpine AS build
# WORKDIR /app
# COPY pom.xml .
# COPY src ./src
# RUN apk add --no-cache maven && mvn -q -DskipTests package && mv target/*.jar app.jar
#
# FROM eclipse-temurin:21-jre-alpine
# WORKDIR /app
# RUN addgroup -S spring && adduser -S spring -G spring
# USER spring:spring
# COPY --from=build /app/app.jar app.jar
# EXPOSE 8080
# ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]
