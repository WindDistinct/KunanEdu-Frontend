import axios from "axios";

////////////////// VALIDACION DE TOKEN FICTICIO /////////////////

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sIjoiYWRtaW5pc3RyYWRvciIsInVzdWFyaW8iOiJQUkpVQU4iLCJpYXQiOjE3NDkwMDI3OTIsImV4cCI6MTc0OTAwNjM5Mn0.DeyWcbND0suAGjS1LlmW9CxHNT8F1e9jgqSEl4Y3mvc";

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL + "/api/aula",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

console.log("Token enviado:", axiosInstance.defaults.headers.Authorization);

///////////////////////////////////////////////////////////////////

export const obtenerAulas = async () => {
	const res = await axiosInstance.get(`/all-adm`);
	return res.data;
};

export const crearAula = async (data) => {
	const res = await axiosInstance.post(`/create`, data);
	return res.data;
};

export const actualizarAula = async (id, data) => {
	const res = await axiosInstance.put(`/update/${id}`, data);
	return res.data;
};

export const eliminarAula = async (id) => {
	const res = await axiosInstance.delete(`/delete/${id}`);
	return res.data;
};

export const auditoriaAula = async (id) => {
	const res = await axiosInstance.get(`/all-audit`);
	return res.data;
};
