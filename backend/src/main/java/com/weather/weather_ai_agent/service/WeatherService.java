/*🧠 What is @Service? (simple)
It tells Spring:
“This class contains business logic. Create and manage it for me.” */
package com.weather.weather_ai_agent.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.weather.weather_ai_agent.ai.GeminiNlpService;
import com.weather.weather_ai_agent.ai.WeatherAIAgent;
import com.weather.weather_ai_agent.exception.CityNotFoundException;
import com.weather.weather_ai_agent.model.WeatherResponse;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Autowired
    private WeatherAIAgent weatherAIAgent;

    @Autowired
    private GeminiNlpService geminiNlpService;

    private final RestTemplate restTemplate = new RestTemplate();

    // 🔹 THIS METHOD WAS MISSING
    private Map<String, Object> getRawWeatherData(String city) {

        if (city == null || city.trim().isEmpty()) {
            throw new IllegalArgumentException("City name must not be empty");
        }

        try {
            String url = "https://api.openweathermap.org/data/2.5/weather?q="
                    + city + "&appid=" + apiKey + "&units=metric";

            return restTemplate.getForObject(url, Map.class);

        } catch (Exception e) {
            throw new CityNotFoundException("City not found");
        }
    }

    // 🔹 MAIN BUSINESS METHOD
    public WeatherResponse getWeather(String userInput) {

        if (userInput == null || userInput.trim().isEmpty()) {
            throw new IllegalArgumentException("Please provide a city name");
        }

        // 1) Try basic cleanup first
        String city = userInput
                .replaceAll("(?i)tell me about|weather|please|today|in", "")
                .trim();

        // 2) If still no city, ask Gemini
        boolean looksLikeCity = city.matches("^[a-zA-Z\\s]+$");

        if (city.isEmpty() || !looksLikeCity) {
            String inferred = geminiNlpService.extractCity(userInput);
            if (!"NONE".equalsIgnoreCase(inferred)) {
                city = inferred;
            }
        }

        // 3) If still no city, ask user politely
        if (city.isEmpty() || "NONE".equalsIgnoreCase(city)) {
            throw new IllegalArgumentException("Which city would you like the weather for?");
        }

        // ---- existing logic below stays the same ----
        Map<String, Object> rawData = getRawWeatherData(city);

        Map<String, Object> main = (Map<String, Object>) rawData.get("main");
        double temp = ((Number) main.get("temp")).doubleValue();
        int humidity = ((Number) main.get("humidity")).intValue();

        List<Map<String, Object>> weatherList
                = (List<Map<String, Object>>) rawData.get("weather");
        String condition = (String) weatherList.get(0).get("description");

        String advice = weatherAIAgent.generateAdvice(temp, humidity, condition);

        WeatherResponse response = new WeatherResponse();
        response.setCity(city);
        response.setTemperature(temp);
        response.setHumidity(humidity);
        response.setCondition(condition);
        response.setAiAdvice(advice);

        return response;
    }

}
