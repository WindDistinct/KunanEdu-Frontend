import axiosInstance from "./axiosInstance";

const createApiService = (resource) => ({
  obtener: () => axiosInstance.get(`/api/${resource}/all`).then(r => r.data),
  obtenerTodos: () => axiosInstance.get(`/api/${resource}/all-adm`).then(r => r.data),
  crear: (data) => axiosInstance.post(`/api/${resource}/create`, data).then(r => r.data),
  actualizar: (id, data) => axiosInstance.put(`/api/${resource}/update/${id}`, data).then(r => r.data),
  eliminar: (id) => axiosInstance.delete(`/api/${resource}/delete/${id}`).then(r => r.data),
  auditar: () => axiosInstance.get(`/api/${resource}/all-audit`).then(r => r.data)
});

const alumnoService = {
  ...createApiService("estudiante"),
  obtenerAlumnosPorAula: (aula, cursoseccion) =>
    axiosInstance.get(`/api/estudiante/alumnos-aula/${aula}/${cursoseccion}`).then(r => r.data),
  obtenerPorPeriodo: (periodoId) =>
    axiosInstance.get(`/api/estudiante/por-periodo/${periodoId}`).then(r => r.data)
};

const usuarioService = {
  ...createApiService("usuario"),
  login: async ({ username, password }) => {
    try {
      const res = await axiosInstance.post(`/api/usuario/login`, { username, password });
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en login";
    }
  }
};

const seccionService = {
  ...createApiService("seccion"),
  obtenerPorGradoYPeriodo: (grado, periodo) => axiosInstance.get(`/api/seccion/grado-periodo/${grado}/${periodo}`).then(r => r.data)
};
 
const gradoService = {
  ...createApiService("grado")
};

const periodoService = {
  ...createApiService("periodo"),
  obtenerSeccionesPeriodo: (idPeriodo) => axiosInstance.get(`/api/periodo/seccion-periodo/${idPeriodo}`).then(r => r.data)
};

const empleadoService = {
  ...createApiService("empleado"),
  obtenerDocentes: () => axiosInstance.get(`/api/empleado/all-docente`).then(r => r.data),
  obtenerEmpleadoUsuarios: () => axiosInstance.get(`/api/empleado/all-usuarios`).then(r => r.data),
  obtenerCursosPorUsuario: (idDocente, periodo) =>
    axiosInstance.get(`/api/empleado/cursos-periodo/${idDocente}/${periodo}`).then(r => r.data)
};

const cursoService = createApiService("curso");
const aulaService = createApiService("aula");

const cursoGradoService = {
  ...createApiService("curso_grado"),
  obtenerCursosPorGrado: (idGrado) =>
    axiosInstance.get(`/api/curso_grado/cursos/${idGrado}`).then(r => r.data)
};

const cursoSeccionService = {
  ...createApiService("curso_seccion"),
  verificarCursosAsignados: (id) =>
    axiosInstance.get(`/api/curso_seccion/verificar-asig/${id}`).then(r => r.data),
  envioListaCursosYdocentes: (data) =>
    axiosInstance.post(`/api/curso_seccion/multiple`, data).then(r => r.data)
};

const matriculaService = createApiService("matricula");

const examenService = {
  ...createApiService("examen"),
  obtenerNotasporAlumno: (idAlumno) => axiosInstance.get(`/api/examen/notas-alum/${idAlumno}`).then(r => r.data),
  registrarNotas: (data) => axiosInstance.post(`/api/examen/multiple`, data).then(r => r.data),
  obtenerNotasBimestre: (aula, bimestre, cursoseccion) => axiosInstance.get(`/api/examen/nota-bimestre/${aula}/${bimestre}/${cursoseccion}`).then(r => r.data),
  obtenerNotasCurso: (docente, periodo, cursoseccion) => axiosInstance.get(`/api/examen/notas-curso/${docente}/${periodo}/${cursoseccion}`).then(r => r.data)
};

const asistenciaService = {
  ...createApiService("asistencia"),
guardarListado: (data) => axiosInstance.post(`/api/asistencia/multiple`, data).then(r => r.data),
  obtenerPorFechaYCurso: (cursoSeccion, fecha) =>
    axiosInstance
      .get(`/api/asistencia/por-fecha`, {
        params: { cursoSeccion, fecha },
      })
      .then((r) => r.data),
}

const notaService = {
  ...createApiService("nota"),
 
  generarReporte: (periodo, alumnoId) =>
    axiosInstance
      .get(`/api/nota/generar-reporte/${periodo}/${alumnoId}`)
      .then(r => r.data)
};

export {
  notaService,asistenciaService,
  examenService,
  aulaService,
  matriculaService,
  cursoSeccionService,
  cursoGradoService,
  usuarioService,
  alumnoService,
  seccionService,
  gradoService,
  periodoService,
  empleadoService,
  cursoService
};
