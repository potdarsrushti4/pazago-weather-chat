# 🌦️ Weather AI Agent

A full-stack **Weather AI Chat Application** that allows users to ask weather-related questions in **natural language** and receive real-time weather data along with **AI-generated advice**.

This project demonstrates:
- Frontend engineering (React + Vite)
- Backend API design (Spring Boot)
- API integrations (OpenWeather, Google Gemini)
- Natural language handling
- Clean error handling and conversational UI

---

## ✨ Features

- 🌍 Ask weather questions in natural language  
  _Example:_ “Tell me about today’s weather”
- 🤖 AI-assisted city extraction using Gemini API
- 🌡️ Real-time weather data from OpenWeather API
- 💬 Chat-style conversational UI
- 🧠 Remembers last city for follow-up questions
- ⚠️ Graceful error handling (city not found, invalid input, API failures)

---

## 🧱 Tech Stack

### Frontend
- React
- Vite
- Axios
- CSS (custom styling)

### Backend
- Java 17
- Spring Boot
- REST APIs
- Maven

### APIs
- **OpenWeather API** – real-time weather data
- **Google Gemini API** – natural language understanding

---

📸 Screenshots
💬 Chat Interface – Natural Language Query
<img width="512" height="294" alt="unnamed" src="https://github.com/user-attachments/assets/efcbbe0b-b7b9-4629-af9b-6d5e9318ce30" />

🌦️ Weather Response with AI Advice
Displays temperature, humidity, weather condition, and AI-generated advice
<img width="512" height="378" alt="unnamed" src="https://github.com/user-attachments/assets/87d46911-f8e6-4ad6-80f5-4883c9975043" />


---
🧠 How the AI Agent Works

- User enters a natural language query
- Backend tries basic city extraction
- If unclear, Gemini API infers the city
- Weather data is fetched from OpenWeather
- AI generates human-friendly advice
- Response is returned in chat format

## 🚀 Deployment

### Frontend Deployment

The frontend is deployed using **Vercel**.

- Built with React + Vite
- Chat interface for interacting with the Weather AI Agent

🔗 **Live Demo**  
> https://pazago-weather-chat-khaki.vercel.app/

---

### Backend Deployment

The backend is a **Spring Boot REST API**.

- Provides endpoint: GET /weather?city=<city or natural language query>

- Handles:
- City extraction
- Weather data fetching
- AI-generated advice
- Error handling

> **Note:**  
> At the time of submission, the backend is configured to run locally and is prepared for cloud deployment. Deployment configurations are included and can be extended using Docker or Java-supported hosting platforms.

---

## 🔐 Environment Variables

The backend requires the following environment variables:

| Variable Name | Description |
|--------------|------------|
| `weather.api.key` | OpenWeather API key |
| `gemini.api.key` | Google Gemini API key |

These should be set in the deployment platform or local environment.

---

## ▶️ Running the Project Locally

### Backend

```bash
cd backend
./mvnw spring-boot:run

