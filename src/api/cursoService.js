import axiosInstance from "./axiosInstance";
 

export const obtenerCursosAd = async () => {
	const res = await axiosInstance.get(`/api/curso/all-adm`);
	return res.data;
};
export const obtenerCursos = async () => {
	const res = await axiosInstance.get(`/api/curso/all`);
	return res.data;
};
export const crearCurso = async (data) => {
	const res = await axiosInstance.post(`/api/curso/create`,data);
	return res.data;
};

export const actualizarCurso = async (id, data) => {
	const res = await axiosInstance.put(`/api/curso/update/${id}`, data);
	return res.data;
};

export const eliminarCurso = async (id) => {
	const res = await axiosInstance.delete(`/api/curso/delete/${id}`);
	return res.data;
};

export const auditoriaCurso = async () => {
	const res = await axiosInstance.get(`/api/curso/all-audit`);
	return res.data;
};
