import axios from "axios";

////////////////// VALIDACION DE TOKEN FICTICIO /////////////////

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sIjoiYWRtaW5pc3RyYWRvciIsInVzdWFyaW8iOiJQUkpVQU4iLCJpYXQiOjE3NDkwMTA4NjksImV4cCI6MTc0OTAxNDQ2OX0.P-LqXdhDP-aTAIqdr6YG5JFZMq9mmIfmJBcURfHPKr8";

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL + "/api/usuario",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

console.log("Token enviado:", axiosInstance.defaults.headers.Authorization);

///////////////////////////////////////////////////////////////////

export const obtenerUsuarios = async () => {
	const res = await axiosInstance.get(`/all-adm`);
	return res.data;
};

export const crearUsuario = async (data) => {
	const res = await axiosInstance.post(`/create`, data);
	return res.data;
};

export const actualizarUsuario = async (id, data) => {
	const res = await axiosInstance.put(`/update/${id}`, data);
	return res.data;
};

export const eliminarUsuario = async (id) => {
	const res = await axiosInstance.delete(`/delete/${id}`);
	return res.data;
};
