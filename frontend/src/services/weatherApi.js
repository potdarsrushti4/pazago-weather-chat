import axios from "axios";

const API_BASE_URL = "https://pazago-weather-chat-1.onrender.com";

export const getWeather = async (city) => {
  const response = await axios.get(
    `${API_BASE_URL}/weather?city=${city}`
  );
  return response.data;
};
