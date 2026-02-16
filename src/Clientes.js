import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import toast from "react-hot-toast";
import styles from "./Clientes.module.css";

const Clientes = ({ onBack }) => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    // Cargar clientes al iniciar
    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            let query = supabase
                .from("clientes")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false }); // Los más nuevos primero

            const { data, error } = await query;

            if (error) throw error;
            setClientes(data);
        } catch (error) {
            toast.error("Error al cargar clientes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Función para borrar cliente
    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return;

        try {
            const { error } = await supabase
                .from("clientes")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setClientes(clientes.filter((c) => c.id !== id));
            toast.success("Cliente eliminado");
        } catch (error) {
            toast.error("No se pudo eliminar");
        }
    };

    // Filtrado en tiempo real
    const clientesFiltrados = clientes.filter(
        (c) =>
            c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            (c.telefono && c.telefono.includes(busqueda)),
    );

    return (
        <div className={styles.container}>
            {/* ENCABEZADO */}
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    ← Volver
                </button>
                <div>
                    <h2 className={styles.title}>Cartera de Clientes</h2>
                    <p className={styles.subtitle}>
                        {clientes.length} contactos guardados
                    </p>
                </div>
            </div>

            {/* BUSCADOR */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o teléfono..."
                    className={styles.searchInput}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    autoFocus
                />
            </div>

            {/* LISTA DE TARJETAS */}
            {loading ? (
                <div className={styles.loading}>Cargando agenda...</div>
            ) : (
                <div className={styles.grid}>
                    {clientesFiltrados.map((cliente) => (
                        <div key={cliente.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>
                                    {cliente.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.nombre}>
                                        {cliente.nombre}
                                    </h3>
                                    <span className={styles.fecha}>
                                        Alta:{" "}
                                        {new Date(
                                            cliente.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.contactInfo}>
                                {cliente.telefono ? (
                                    <div className={styles.dataRow}>
                                        📞 {cliente.telefono}
                                    </div>
                                ) : (
                                    <div
                                        className={styles.dataRow}
                                        style={{ opacity: 0.5 }}
                                    >
                                        Sin teléfono
                                    </div>
                                )}
                                {cliente.email && (
                                    <div className={styles.dataRow}>
                                        ✉️ {cliente.email}
                                    </div>
                                )}
                            </div>

                            <div className={styles.actions}>
                                {cliente.telefono && (
                                    <a
                                        href={`https://wa.me/${cliente.telefono.replace(/[^0-9]/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.whatsappBtn}
                                    >
                                        WhatsApp
                                    </a>
                                )}
                                <button
                                    onClick={() =>
                                        handleDelete(cliente.id, cliente.nombre)
                                    }
                                    className={styles.deleteBtn}
                                    title="Eliminar cliente"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}

                    {clientesFiltrados.length === 0 && !loading && (
                        <div className={styles.emptyState}>
                            <p>No se encontraron clientes.</p>
                            <small>
                                Guarda un presupuesto nuevo para agregar
                                clientes aquí.
                            </small>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Clientes;
