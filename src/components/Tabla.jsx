import React, { useState } from "react";

export default function Tabla({
  columnas,
  datos,
  onEditar,
  onEliminar,
  idKey = "id",
  mostrarAcciones = true,
  filasPorPagina = 5,
   textoBotonAccion = "Editar", // NUEVO: texto por defecto
  soloBotonEditar = false, 
}) {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(datos.length / filasPorPagina);

  const datosPaginados = datos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  const renderValor = (key, valor) => {
    if (key === "estado") {
      return valor === true ? "Activo" : "Inactivo";
    }

    if (typeof valor === "string" && (key.includes("fec") || key.includes("fecha") || key.includes("fecha_matricula"))) {
      const [año, mes, dia] = valor.split("-");
      return `${dia}/${mes}/${año}`;
    }
    return valor;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-sm w-full">
          <thead className="bg-base-200">
            <tr>
              {columnas.map(({ key, label }) => (
                <th key={key}>{label}</th>
              ))}
              {mostrarAcciones && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {datosPaginados.map((item) => (
              <tr key={item[idKey]}>
                {columnas.map(({ key }) => (
                  <td key={key}>{renderValor(key, item[key])}</td>
                ))}
                {mostrarAcciones && (
                  <td className="flex gap-1">
                    <button
                      onClick={() => onEditar(item)}
                      className="btn btn-info btn-xs"
                    >
                      {textoBotonAccion}
                    </button>

                    {!soloBotonEditar && (
                      <button
                        onClick={() => onEliminar(item[idKey])}
                        className="btn btn-error btn-xs"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación DaisyUI */}
      <div className="flex justify-center mt-4">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            disabled={paginaActual === 1}
            onClick={() => cambiarPagina(paginaActual - 1)}
          >
            «
          </button>

          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i + 1}
              className={`join-item btn btn-sm ${paginaActual === i + 1 ? "btn-active" : ""}`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="join-item btn btn-sm"
            disabled={paginaActual === totalPaginas}
            onClick={() => cambiarPagina(paginaActual + 1)}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
}