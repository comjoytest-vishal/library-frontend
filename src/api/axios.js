/*
import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 10000
});

export default api;
*/

import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 10000
});

// Request interceptor
api.interceptors.request.use((config) => {

    config.metadata = {
        startTime: performance.now()
    };

    console.log(
        `🚀 API Request Started: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
});

// Response interceptor
api.interceptors.response.use(

    (response) => {

        const duration =
            performance.now() - response.config.metadata.startTime;

        console.log(
            `✅ API Response: ${response.config.url} | ${duration.toFixed(2)} ms`
        );

        return response;
    },

    (error) => {

        if (error.config?.metadata?.startTime) {

            const duration =
                performance.now() - error.config.metadata.startTime;

            console.error(
                `❌ API Failed: ${error.config.url} | ${duration.toFixed(2)} ms`,
                error.message
            );
        }

        return Promise.reject(error);
    }
);

export default api;