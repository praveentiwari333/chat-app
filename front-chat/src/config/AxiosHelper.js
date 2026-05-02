import axios from "axios";

export const baseURL = "https://chatbackend-250i.onrender.com";

export const httpClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "text/plain",
  },
});
