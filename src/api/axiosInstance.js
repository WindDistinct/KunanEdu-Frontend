import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;