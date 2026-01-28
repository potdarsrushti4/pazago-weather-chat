FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy project files
COPY . .

# Fix permission for mvnw (Windows → Linux issue)
RUN chmod +x mvnw

# Build Spring Boot jar
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the app
CMD ["java", "-jar", "target/weather-ai-agent-0.0.1-SNAPSHOT.jar"]