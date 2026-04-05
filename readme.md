# Snippet Share

A Spring Boot application for sharing code snippets and files.

## Tech Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** JPA/Hibernate (configurable)
- **Security:** JWT Authentication
- **Build Tool:** Maven

## Features

- User authentication (signup/login) with JWT
- File upload and storage
- URL shortening
- RESTful API with OpenAPI documentation

## Project Structure

```
src/main/java/com/github/ahmed_zein/snippet_share/
├── controllers/      # REST controllers
├── services/        # Business logic
├── repositories/    # Data access
├── models/          # Entity classes
├── dto/             # Data transfer objects
├── mappers/         # Object mappers
├── config/          # Configuration classes
└── filters/        # Security filters
```

## Running

```bash
./mvnw spring-boot:run
```

## API Documentation

Available at `/swagger-ui.html` when running.
