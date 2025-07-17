import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { alumnoService } from "../../api/requestApi";

export default function HistorialAcademico() {
    const { id } = useParams();
    const [historial, setHistorial] = useState([]);
    const navigate = useNavigate();
  

  useEffect(() => {
    alumnoService.obtenerHistorial(id)
      .then(setHistorial)
      .catch(err => console.error("Error al obtener historial:", err));
  }, [id]);

  return (
    <div>
    <button className="btn btn-secondary mb-4" onClick={() => navigate("/alumnos")}>
        ← Volver al Listado
    </button>
      <h2>Historial Académico</h2>
      {historial.map(periodo => (
        <div key={periodo.periodo} className="mb-4 border p-2 rounded">
          <h4>{periodo.periodo} - {periodo.descripcion} ({periodo.progreso})</h4>
          {periodo.cursos.map(curso => (
            <div key={curso.nombre_curso}>
              <strong>{curso.nombre_curso}</strong>
              <ul>
                {curso.bimestres.map(b => (
                  <li key={b.bimestre}>
                    {b.bimestre}: {b.promedio}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
