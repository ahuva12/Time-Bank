import axios from "axios";

export const http = axios.create({
    baseURL: "/api",
    headers: {
        "Content-type": "application/json",
    }
});
