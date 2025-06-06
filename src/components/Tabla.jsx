import React from "react";
import "../styles/Tablas.css";

export default function Tabla({
  columnas,
  datos,
  onEditar,
  onEliminar,
  idKey = "id",
  mostrarAcciones = true,  
}) {
  return (
    <table className="tabla">
      <thead>
        <tr>
          {columnas.map(({ key, label }) => (
            <th key={key} className="encabezado-columna">
              {label}
            </th>
          ))}
          {mostrarAcciones && <th className="encabezado-columna">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {datos.map((item) => (
          <tr key={item[idKey]}>
            {columnas.map(({ key }) => (
              <td key={key} className="celda">
                {key === "estado" ? (item[key] ? "Activo" : "Inactivo") : item[key]}
              </td>
            ))}
            {mostrarAcciones && (
              <td className="celda acciones">
                <button onClick={() => onEditar(item)} className="btn-editar">
                  Editar
                </button>
                <button onClick={() => onEliminar(item[idKey])} className="btn-eliminar">
                  Eliminar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}