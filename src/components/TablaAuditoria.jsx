import React from "react";
import "../styles/Tablas.css";

export default function TablaAuditoria({
    columnas,
    datos,
    idKey = "id",
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
                </tr>
            </thead>
            <tbody>
                {datos.map((item) => (
                    <tr key={item[idKey]}>
                        {columnas.map(({ key }) => (
                            <td key={key} className="celda">
                                {key === "estado"
                                    ? item[key]
                                        ? "Activo"
                                        : "Inactivo"
                                    : item[key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
