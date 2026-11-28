
import axios from "axios";

const api = axios.create({
    baseURL: "https://muhammadiyamission.online/library/backend/public/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },

});

export default api;
