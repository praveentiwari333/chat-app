import axios from "axios";

export const baseURL = "https://chatback-latest-6r9u.onrender.com";

export const httpClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "text/plain",
  },
});
