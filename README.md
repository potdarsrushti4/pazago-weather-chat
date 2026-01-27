# 🌦️ Weather Agent Chat Application

A full-stack chat-based weather assistant built as part of the **Pazago Frontend Assignment**.

---

## ✨ Features
- Conversational chat interface
- Natural language weather queries
- Context-aware follow-up questions
- AI-powered city inference (Gemini fallback)
- Real-time weather data
- Graceful error handling

---

## 🧠 Architecture
This project is structured as a **monorepo**:

- **Frontend**: React + Vite (chat UI)
- **Backend**: Spring Boot (weather & AI logic)

Frontend communicates with backend via REST APIs.

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Spring Boot
- OpenWeatherMap API
- Gemini API (for NLP fallback)

---

## ▶️ How to Run Locally

### Backend
```bash
cd backend
./mvnw spring-boot:run
