import axios from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Intercepts request by a user
export const axiosReq = axios.create();
// Intercepts response from an api
export const axiosRes = axios.create();
