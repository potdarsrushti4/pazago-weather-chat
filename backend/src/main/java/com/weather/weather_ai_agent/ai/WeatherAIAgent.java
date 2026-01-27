package com.weather.weather_ai_agent.ai;

import org.springframework.stereotype.Component;

@Component
public class WeatherAIAgent {

    public String generateAdvice(double temperature, int humidity, String condition) {

        if (condition.contains("rain")) {
            return "Carry an umbrella ☔";
        }

        if (temperature > 35) {
            return "It's very hot 🔥 Stay hydrated!";
        }

        if (temperature < 15) {
            return "It's cold ❄️ Wear warm clothes";
        }

        if (condition.contains("clear")) {
            return "Perfect weather to go outside ☀️";
        }

        if (humidity > 70) {
            return "High humidity 💧 Stay comfortable indoors";
        }

        return "Have a nice day 🙂";
    }
}

