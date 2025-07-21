import axios from "axios";

const API_BASE_URL_TENDERLY = import.meta.env?.VITE_BASE_TENDERLY_API_PATH;

export const axiosTenderlyInstance = axios.create({
  baseURL: API_BASE_URL_TENDERLY,
  headers: {
    "X-Access-Key": import.meta.env?.VITE_BASE_TENDERLY_API_KEY,
  },
});
