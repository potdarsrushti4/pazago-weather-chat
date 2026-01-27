import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const getWeather = async (city) => {
  const response = await axios.get(
    `${API_BASE_URL}/weather?city=${city}`
  );
  return response.data;
};
