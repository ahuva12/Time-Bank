import axios from "axios";

export const http = axios.create({
    baseURL: "/api/timebank",
    headers: {
        "Content-type": "application/json",
    }
});
