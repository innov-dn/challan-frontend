import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL
    || "http://localhost:8080";

const BASE = `${BASE_URL}/api/challan`;

const api = {
    generate:     (data)   =>
        axios.post(`${BASE}/generate`, data),
    getAll:       ()       =>
        axios.get(`${BASE}/all`),
    getByVehicle: (vNum)   =>
        axios.get(`${BASE}/vehicle/${vNum}`),
    updateStatus: (id, st) =>
        axios.put(`${BASE}/${id}/status?status=${st}`),
    downloadPdf:  (id)     =>
        window.open(`${BASE}/${id}/pdf`, "_blank"),
};

export default api;