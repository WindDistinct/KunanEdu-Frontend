import axios from "axios";

////////////////// VALIDACION DE TOKEN FICTICIO /////////////////

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sIjoiYWRtaW5pc3RyYWRvciIsInVzdWFyaW8iOiJQUkpVQU4iLCJpYXQiOjE3NDkwMDczMTQsImV4cCI6MTc0OTAxMDkxNH0.p8GFySgZj-Pzh3OBL6R4KSOJ0RXdMKxpfGVyT-tSmc0";

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL + "/api/grado",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

console.log("Token enviado:", axiosInstance.defaults.headers.Authorization);

///////////////////////////////////////////////////////////////////

export const obtenerGrados = async () => {
	const res = await axiosInstance.get(`/all-adm`);
	return res.data;
};

export const crearGrado = async (data) => {
	const res = await axiosInstance.post(`/create`, data);
	return res.data;
};

export const actualizarGrado = async (id, data) => {
	const res = await axiosInstance.put(`/update/${id}`, data);
	return res.data;
};

export const eliminarGrado = async (id) => {
	const res = await axiosInstance.delete(`/delete/${id}`);
	return res.data;
};
