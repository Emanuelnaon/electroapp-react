import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import toast from "react-hot-toast";
import styles from "./Historial.module.css";

const Historial = ({ onBack }) => {
    const [presupuestos, setPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        fetchPresupuestos();
    }, []);

    const fetchPresupuestos = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            // Traemos presupuestos y hacemos el "join" con clientes para tener el nombre
            const { data, error } = await supabase
                .from("presupuestos")
                .select(
                    `
                    *,
                    clientes ( nombre )
                `,
                )
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPresupuestos(data);
        } catch (error) {
            toast.error("Error al cargar historial");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este presupuesto del historial?"))
            return;
        try {
            const { error } = await supabase
                .from("presupuestos")
                .delete()
                .eq("id", id);
            if (error) throw error;
            setPresupuestos(presupuestos.filter((p) => p.id !== id));
            toast.success("Presupuesto eliminado");
        } catch (error) {
            toast.error("No se pudo eliminar");
        }
    };

    const filtrados = presupuestos.filter((p) =>
        p.clientes?.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    ← Volver
                </button>
                <h2 className={styles.title}>Historial de Presupuestos</h2>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre de cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {loading ? (
                <p>Cargando registros...</p>
            ) : (
                <div className={styles.list}>
                    {filtrados.map((p) => (
                        <div key={p.id} className={styles.card}>
                            <div className={styles.cardMain}>
                                <span className={styles.date}>
                                    {new Date(p.fecha).toLocaleDateString()}
                                </span>
                                <h3 className={styles.clientName}>
                                    {p.clientes?.nombre || "Cliente eliminado"}
                                </h3>
                                <p className={styles.total}>
                                    Total:{" "}
                                    <strong>${p.total.toLocaleString()}</strong>
                                </p>
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    className={styles.btnView}
                                    onClick={() =>
                                        alert("Re-impresión en desarrollo")
                                    }
                                >
                                    👁️ Ver
                                </button>
                                <button
                                    className={styles.btnDelete}
                                    onClick={() => handleDelete(p.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Historial;
