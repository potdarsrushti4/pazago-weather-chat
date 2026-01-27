package com.weather.weather_ai_agent.ai;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class GeminiNlpService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Ask Gemini to extract a city name from text. Return "NONE" if no city is
     * present.
     */
    public String extractCity(String userInput) {
        try {
            String prompt = """
            Extract the city name from the following sentence.
            If no city is mentioned, reply with exactly: NONE

            Sentence: "%s"
            """.formatted(userInput);

            String url
                    = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                    + geminiApiKey;

            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request
                    = new HttpEntity<>(body, headers);

            Map<?, ?> response
                    = restTemplate.postForObject(url, request, Map.class);

            if (response == null || !response.containsKey("candidates")) {
                return "NONE";
            }

            var candidates = (List<?>) response.get("candidates");
            if (candidates.isEmpty()) {
                return "NONE";
            }

            var content = (Map<?, ?>) candidates.get(0);
            var parts = (List<?>) ((Map<?, ?>) content.get("content")).get("parts");

            if (parts.isEmpty()) {
                return "NONE";
            }

            String text = (String) ((Map<?, ?>) parts.get(0)).get("text");
            return text == null ? "NONE" : text.trim();

        } catch (Exception e) {
            // 🔴 CRITICAL: Gemini must NEVER crash the app
            return "NONE";
        }
    }

}