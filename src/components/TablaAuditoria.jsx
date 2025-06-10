import React, { useState } from "react";

export default function TablaAuditoria({
  columnas,
  datos,
  idKey = "id",
  filasPorPagina = 5,
}) {
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.ceil(datos.length / filasPorPagina);

  const datosPaginados = datos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  const camposFechaConHora = ["fecha_modificacion"];
  const camposSoloFecha = ["fec_nac_anterior", "fec_nac_nuevo"];

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  const formatearCampo = (key, valor) => {
    if (!valor) return "";

    if (camposFechaConHora.includes(key)) {
      return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(valor));
    }

    if (camposSoloFecha.includes(key)) {
      return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(valor));
    }

    return valor;
  };

  const renderCelda = (key, valor) => {
    if (key === "operacion") {
      const estilo =
        valor === "INSERT"
          ? "badge-success"
          : valor === "UPDATE"
          ? "badge-warning"
          : "badge-error";

      return <span className={`badge ${estilo} text-xs`}>{valor}</span>;
    }

    return <span className="text-xs">{formatearCampo(key, valor)}</span>;
  };

  return (
    <div className="container overflow-x-auto min-h-[300px]">
      <table className="table table-zebra table-sm w-full">
        <thead className="bg-base-200">
          <tr>
            {columnas.map(({ key, label }) => (
              <th key={key} className="whitespace-nowrap text-xs">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datosPaginados.map((item) => (
            <tr key={item[idKey]}>
              {columnas.map(({ key }) => (
                <td key={key} className="whitespace-nowrap">
                  {renderCelda(key, item[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fixed  left-0 w-full  py-2   z-50 flex justify-center">
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
              className={`join-item btn btn-sm ${
                paginaActual === i + 1 ? "btn-active" : ""
              }`}
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
    </div>
  );
}