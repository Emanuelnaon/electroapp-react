import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import toast from "react-hot-toast";
import styles from "./Historial.module.css";

const Historial = ({ onBack }) => {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    // Cargar datos al iniciar
    useEffect(() => {
        cargarPresupuestos();
    }, []);

    const cargarPresupuestos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Traemos el presupuesto y el nombre del cliente asociado
            const { data, error } = await supabase
                .from('presupuestos')
                .select(`
                    *,
                    clientes ( nombre )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLista(data);
        } catch (error) {
            console.error(error);
            toast.error("Error cargando historial");
        } finally {
            setLoading(false);
        }
    };

    const borrarPresupuesto = async (id) => {
        if(!window.confirm("¿Seguro que quieres borrar este presupuesto?")) return;

        try {
            const { error } = await supabase.from('presupuestos').delete().eq('id', id);
            if (error) throw error;
            
            // Actualizar lista visualmente
            setLista(lista.filter(item => item.id !== id));
            toast.success("Eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar");
        }
    };

    // Filtrar por nombre de cliente
    const filtrados = lista.filter(item => 
        item.clientes?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className={styles.container}>
            {/* ENCABEZADO */}
            <div className={styles.topBar}>
                <button onClick={onBack} className={styles.backBtn}>← Volver</button>
                <h2 className={styles.title}>Historial de Presupuestos</h2>
            </div>

            {/* BUSCADOR */}
            <input 
                type="text" 
                placeholder="🔍 Buscar por cliente..." 
                className={styles.searchInput}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* LISTA */}
            {loading ? <p className={styles.loading}>Cargando...</p> : (
                <div className={styles.grid}>
                    {filtrados.length === 0 && <p>No hay presupuestos guardados.</p>}
                    
                    {filtrados.map((p) => (
                        <div key={p.id} className={styles.card}>
                            <div className={styles.cardInfo}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.date}>{p.fecha}</span>
                                    <span className={styles.idBadge}>#{p.id}</span>
                                </div>
                                <h3 className={styles.clientName}>
                                    {p.clientes?.nombre || "Cliente Eliminado"}
                                </h3>
                                <p className={styles.total}>
                                    Total: <span>${p.total?.toLocaleString()}</span>
                                </p>
                                <p className={styles.itemCount}>
                                    {p.items?.length || 0} items en la lista
                                </p>
                            </div>
                            
                            <div className={styles.actions}>
                                {/* En el futuro aquí pondremos "Ver / Editar" */}
                                <button className={styles.btnAction} onClick={() => toast("Función Ver/Editar pronto...")}>
                                    👁️ Ver
                                </button>
                                <button className={styles.btnDelete} onClick={() => borrarPresupuesto(p.id)}>
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