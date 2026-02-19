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
      const { data: { user } } = await supabase.auth.getUser();

      // AQUÍ ESTÁ EL TRUCO: Traemos al cliente Y sus presupuestos
      const { data, error } = await supabase
        .from('clientes')
        .select(`
            *,
            presupuestos ( total )
        `)
        .eq('user_id', user.id)
        .order('nombre', { ascending: true });

      if (error) throw error;

      // Calculamos los totales en Javascript para mostrarlos
      const clientesConTotales = data.map(cliente => {
        const totalGastado = cliente.presupuestos?.reduce((sum, p) => sum + (p.total || 0), 0) || 0;
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

  const handleDelete = async (id) => {
    if (!window.confirm("¿Borrar cliente? Se borrarán también sus presupuestos.")) return;
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) throw error;
      setClientes(clientes.filter((c) => c.id !== id));
      toast.success("Cliente eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const filtrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.topBar}>
        <button onClick={onBack} className={styles.backBtn}>← Volver</button>
        <h2 className={styles.title}>Mis Clientes</h2>
      </div>

      {/* BUSCADOR */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.statsBadge}>
          {clientes.length} Clientes
        </div>
      </div>

      {/* LISTA */}
      {loading ? (
        <div className={styles.loading}>Cargando cartera...</div>
      ) : (
        <div className={styles.grid}>
          {filtrados.map((cliente) => (
            <div key={cliente.id} className={styles.card}>
              
              <div className={styles.cardMain}>
                <div className={styles.avatar}>
                   {cliente.nombre.charAt(0).toUpperCase()}
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{cliente.nombre}</h3>
                  {cliente.telefono && <p className={styles.detail}>📞 {cliente.telefono}</p>}
                  {cliente.email && <p className={styles.detail}>✉️ {cliente.email}</p>}
                </div>
              </div>

              {/* SECCIÓN NUEVA: ESTADÍSTICAS FINANCIERAS */}
              <div className={styles.financials}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Trabajos</span>
                    <span className={styles.statValue}>{cliente.cantidadPresupuestos}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Facturado</span>
                    <span className={styles.statValueMoney}>
                        ${cliente.totalGastado.toLocaleString()}
                    </span>
                </div>
              </div>

              <button 
                onClick={() => handleDelete(cliente.id)} 
                className={styles.deleteBtn}
                title="Eliminar Cliente"
              >
                🗑️
              </button>
            </div>
          ))}
          
          {filtrados.length === 0 && (
            <p className={styles.emptyState}>No se encontraron clientes.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Clientes;