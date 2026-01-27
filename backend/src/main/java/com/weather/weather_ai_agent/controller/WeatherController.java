package com.weather.weather_ai_agent.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.weather.weather_ai_agent.model.WeatherResponse;
import com.weather.weather_ai_agent.service.WeatherService;

@RestController
public class WeatherController {

    /*@Autowired

Spring injects the WeatherService automatically. */
    @Autowired
    private WeatherService weatherService;

    @GetMapping("/weather")
    public WeatherResponse getWeather(@RequestParam String city) {
        return weatherService.getWeather(city);
    }

}
