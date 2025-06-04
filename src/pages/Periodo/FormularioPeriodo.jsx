import React, { useEffect, useState } from "react";
import {actualizarPeriodo, crearPeriodo } from "../../api/periodoService";
import "../../styles/Botones.css";
import "../../styles/inputs.css";
import "../../styles/Notificacion.css";

export default function FormularioPeriodo({ onExito, initialData }) {
    const [form, setForm] = useState({ 
        anio: "",
        descripcion: "",
        progreso: "",
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.anio || !form.descripcion || !form.progreso) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            if (form.id_periodo) {
                await actualizarPeriodo(form.id_periodo, { ...form, estado: 1 });
                onExito("Periodo actualizado con éxito");
            } else {
                await crearPeriodo(form);
                onExito("Periodo registrado con éxito");
            }
            setForm({ 
                anio: "",
                descripcion: "",
                progreso: "" 
            });
        } catch (err) {
            setError(
                "Error al guardar. Verifique.",
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            {error && <div className="error grid2">{error}</div>}

            <input
				name="anio"
				placeholder="Año"
				className="input-form"
				value={form.anio}
				onChange={handleChange}
				maxLength={4}
				inputMode="numeric"
			/>

            <select
            name="descripcion"
            className="input-form"
            value={form.descripcion}
            onChange={handleChange}
            required
            >
            <option value="" disabled>Seleccione descripción</option>
            <option value="Año escolar">Año Escolar</option>
            <option value="Vacacional">Vacacional</option>
            </select>

            <select
            name="progreso"
            className="input-form"
            value={form.progreso}
            onChange={handleChange}
            required
            >
            <option value="" disabled>Seleccione progreso</option>
            <option value="En curso">En Curso</option>
            <option value="Finalizado">Finalizado</option>
            </select>

            <div className="grid2">
                <button type="submit" className="aceptar-button">
                    {form.id_periodo ? "Actualizar" : "Registrar"} Periodo
                </button>
            </div>
        </form>
    );
}
