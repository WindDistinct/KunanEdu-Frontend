import axios from "axios";

////////////////// VALIDACION DE TOKEN FICTICIO /////////////////

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sIjoiYWRtaW5pc3RyYWRvciIsInVzdWFyaW8iOiJQUkpVQU4iLCJpYXQiOjE3NDkwMDczMTQsImV4cCI6MTc0OTAxMDkxNH0.p8GFySgZj-Pzh3OBL6R4KSOJ0RXdMKxpfGVyT-tSmc0";

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL + "/api/periodo",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

console.log("Token enviado:", axiosInstance.defaults.headers.Authorization);

///////////////////////////////////////////////////////////////////

export const obtenerPeriodos = async () => {
	const res = await axiosInstance.get(`/all-adm`);
	return res.data;
};

export const crearPeriodo = async (data) => {
	const res = await axiosInstance.post(`/create`, data);
	return res.data;
};

export const actualizarPeriodo = async (id, data) => {
	const res = await axiosInstance.put(`/update/${id}`, data);
	return res.data;
};

export const eliminarPeriodo = async (id) => {
	const res = await axiosInstance.delete(`/delete/${id}`);
	return res.data;
};
