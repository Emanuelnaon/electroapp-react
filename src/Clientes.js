import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import toast from "react-hot-toast";
import styles from "./Clientes.module.css";

const Clientes = ({ onBack }) => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from("clientes")
                .select(
                    `
                    *,
                    presupuestos ( total )
                `,
                )
                .eq("user_id", user.id)
                .order("nombre", { ascending: true });

            if (error) throw error;

            const clientesConTotales = data.map((cliente) => {
                const totalGastado =
                    cliente.presupuestos?.reduce(
                        (sum, p) => sum + (p.total || 0),
                        0,
                    ) || 0;
                const cantidadPresupuestos = cliente.presupuestos?.length || 0;
                return { ...cliente, totalGastado, cantidadPresupuestos };
            });

            setClientes(clientesConTotales);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar clientes");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("¿Borrar cliente y todo su historial?")) return;

        try {
            const { error } = await supabase
                .from("clientes")
                .delete()
                .eq("id", id);
            if (error) throw error;
            setClientes(clientes.filter((c) => c.id !== id));
            toast.success("Cliente eliminado");
        } catch (error) {
            toast.error("Error al eliminar");
        }
    };

    const filtrados = clientes.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );

    return (
        <div className={styles.container}>
            {/* BARRA DE HERRAMIENTAS */}
            <div className={styles.toolbar}>
                
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* TITULO DE SECCIÓN */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>
                    Cartera de Clientes ({clientes.length})
                </h2>
            </div>

            {/* GRID DE TARJETAS */}
            {loading ? (
                <div className={styles.loading}>Cargando datos...</div>
            ) : (
                <div className={styles.grid}>
                    {filtrados.map((cliente) => (
                        <div key={cliente.id} className={styles.card}>
                            {/* CABECERA */}
                            <div className={styles.cardTop}>
                                <div className={styles.avatar}>
                                    {cliente.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.cardHeaderInfo}>
                                    <h3 className={styles.name}>
                                        {cliente.nombre}
                                    </h3>
                                    <span className={styles.clientId}>
                                        ID: {cliente.id}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(cliente.id, e)}
                                    className={styles.deleteBtn}
                                    title="Eliminar"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* CUERPO */}
                            <div className={styles.cardBody}>
                                {cliente.telefono ? (
                                    <div className={styles.contactRow}>
                                        <span>📞</span> {cliente.telefono}
                                    </div>
                                ) : (
                                    <div
                                        className={`${styles.contactRow} ${styles.missing}`}
                                    >
                                        <span>📞</span> Sin teléfono
                                    </div>
                                )}

                                {cliente.email ? (
                                    <div className={styles.contactRow}>
                                        <span>✉️</span> {cliente.email}
                                    </div>
                                ) : (
                                    <div
                                        className={`${styles.contactRow} ${styles.missing}`}
                                    >
                                        <span>✉️</span> Sin email
                                    </div>
                                )}
                            </div>

                            {/* PIE (Dinero) */}
                            <div className={styles.cardFooter}>
                                <div className={styles.statBox}>
                                    <span className={styles.statLabel}>
                                        Trabajos
                                    </span>
                                    <span className={styles.statNumber}>
                                        {cliente.cantidadPresupuestos}
                                    </span>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.statBox}>
                                    <span className={styles.statLabel}>
                                        Total Facturado
                                    </span>
                                    <span className={styles.statMoney}>
                                        ${cliente.totalGastado.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filtrados.length === 0 && (
                <p className={styles.emptyState}>No se encontraron clientes.</p>
            )}
        </div>
    );
};

export default Clientes;
