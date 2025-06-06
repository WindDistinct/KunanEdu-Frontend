// src/services/examenService.js
import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const axiosInstance = axios.create({
	baseURL: "https://kunanedu-backend.onrender.com",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

// Obtener notas por ID de alumno
export const obtenerNotasPorAlumno = async (idAlumno) => {
	const res = await axiosInstance.get(`/api/examen/notas-alum/${idAlumno}`);
	return res.data;
};
