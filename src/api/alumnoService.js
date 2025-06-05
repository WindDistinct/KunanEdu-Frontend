import axiosInstance from "./axiosInstance";

export const obtenerAlumnos = async () => {
	const res = await axiosInstance.get(`/api/estudiante/all-adm`);
	return res.data;
};

export const crearAlumno = async (data) => {
	const res = await axiosInstance.post(`/api/estudiante/create`, data);
	return res.data;
};

export const actualizarAlumno = async (id, data) => {
	const res = await axiosInstance.put(`/api/estudiante/update/${id}`, data);
	return res.data;
};

export const eliminarAlumno = async (id) => {
	const res = await axiosInstance.delete(`/api/estudiante/delete/${id}`);
	return res.data;
};

export const auditoriaAlumno = async (id) => {
	const res = await axiosInstance.get(`/api/estudiante/all-audit`);
	return res.data;
};
