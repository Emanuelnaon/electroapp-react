// DashboardHome.js
import React, { useState, useEffect } from "react"; // ✅ Agregados useState y useEffect
import styles from "./DashboardHome.module.css";
import { supabase } from "./supabaseClient";

const DashboardHome = ({
    user,
    isSuperAdmin,
    onOpenWaitlist,
    onOpenCotizador,
    onOpenClientes,
}) => {
    // 1. Estado para el contador
    const [totalClientes, setTotalClientes] = useState(0);

    // 2. Efecto para contar clientes reales
    useEffect(() => {
        const fetchCount = async () => {
            if (!user) return;

            const { count } = await supabase
                .from("clientes")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id);

            setTotalClientes(count || 0);
        };
        fetchCount();
    }, [user]);


    // 3. Las Herramientas (Con Clientes activado y descripción dinámica)
    const tools = [
        {
            id: "cotizador",
            title: "Presupuestador",
            icon: "⚡",
            desc: "Crea cotizaciones profesionales en PDF en minutos.",
            status: "active",
            action: onOpenCotizador,
        },
        {
            id: "clientes",
            title: "Gestión de Clientes",
            icon: "👥",
            // ✅ Descripción dinámica: Muestra la cantidad si hay, sino el texto default
            desc:
                totalClientes > 0
                    ? `${totalClientes} contactos guardados.`
                    : "Base de datos de tus clientes, historial y deudas.",
            status: "active", // ✅ ACTIVADO (Antes estaba 'coming')
            action: onOpenClientes,
        },
        {
            id: "proveedores",
            title: "Proveedores",
            icon: "📦",
            desc: "Lista de precios y contactos de materiales.",
            status: "coming",
            action: () => alert("Módulo de Proveedores en construcción"),
        },
        {
            id: "perfil",
            title: "Perfil Público",
            icon: "🌐",
            desc: "Tu web personal para mostrar tus trabajos.",
            status: "coming",
            action: () => alert("Configuración de Perfil en construcción"),
        },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.welcomeHeader}>
                <h2>¡Hola, {user.email.split("@")[0]}! 👋</h2>
                <p>¿Qué vamos a hacer hoy?</p>
            </header>

            {/* GRILLA DE HERRAMIENTAS (Tu diseño original) */}
            <div className={styles.grid}>
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        className={`${styles.card} ${tool.status === "coming" ? styles.disabled : ""}`}
                        onClick={tool.action}
                    >
                        <div className={styles.iconCircle}>{tool.icon}</div>
                        <h3 className={styles.cardTitle}>{tool.title}</h3>
                        <p className={styles.cardDesc}>{tool.desc}</p>
                        {tool.status === "coming" && (
                            <span className={styles.badge}>Próximamente</span>
                        )}
                    </div>
                ))}
            </div>

            {/* BOTÓN SECRETO SOLO PARA TI (SUPER ADMIN) */}
            {isSuperAdmin && (
                <div className={styles.superAdminZone}>
                    <div className={styles.divider}></div>
                    <p className={styles.zoneTitle}>🛠️ Zona de Super Admin</p>
                    <button
                        onClick={onOpenWaitlist}
                        className={styles.superAdminBtn}
                    >
                        Ver Lista de Espera ({user.email})
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
