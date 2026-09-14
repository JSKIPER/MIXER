# Mixer

A real-time web messenger built with Spring Boot, PostgreSQL, JWT authentication, and WebSockets.

![Mixer chat screen](https://i.imgur.com/jFioibs.png)

## Features

- User registration and login
- JWT-based authentication
- Password hashing with BCrypt
- Search users by tag
- Direct messages
- Real-time incoming messages with STOMP over WebSocket
- Persistent chat and message history
- Chat list sorted by latest message
- Automatically assigned avatar themes


## Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL
- JWT
- WebSocket, STOMP, SockJS
- Lombok

### Frontend

- HTML
- CSS
- Vanilla JavaScript

## Architecture

```text
Browser
  |
  | REST API + JWT
  v
Spring Boot
  |
  | JPA / Hibernate
  v
PostgreSQL

Browser
  |
  | STOMP over WebSocket
  v
Spring Boot WebSocket broker