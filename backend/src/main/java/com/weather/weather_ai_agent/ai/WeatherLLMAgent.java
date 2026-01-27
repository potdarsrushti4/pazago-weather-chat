package com.weather.weather_ai_agent.ai;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

//@Component
public class WeatherLLMAgent {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateAdvice(
            String city,
            double temperature,
            int humidity,
            String condition) {

        String prompt = """
            You are a helpful weather assistant.
            Weather details:
            City: %s
            Temperature: %.1f°C
            Humidity: %d%%
            Condition: %s

            Give short, friendly advice in one sentence.
            """.formatted(city, temperature, humidity, condition);

        return callOpenAI(prompt);
    }

    private String callOpenAI(String prompt) {

        String url = "https://api.openai.com/v1/chat/completions";

        Map<String, Object> body = Map.of(
            "model", "gpt-4o-mini",
            "messages", List.of(
                Map.of("role", "user", "content", prompt)
            ),
            "temperature", 0.7
        );

        Map<String, String> headers = Map.of(
            "Authorization", "Bearer " + openAiApiKey,
            "Content-Type", "application/json"
        );

        var request = new org.springframework.http.HttpEntity<>(body, new org.springframework.http.HttpHeaders() {{
            headers.forEach(this::set);
        }});

        Map response = restTemplate.postForObject(url, request, Map.class);

        List choices = (List) response.get("choices");
        Map message = (Map) ((Map) choices.get(0)).get("message");

        return (String) message.get("content");
    }
}
