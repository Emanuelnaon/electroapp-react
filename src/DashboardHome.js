import React from "react";
import styles from "./DashboardHome.module.css";

const DashboardHome = ({ user, isSuperAdmin, onOpenWaitlist, onOpenCotizador}) => {
    // Las 4 Herramientas que pediste
    const tools = [
        {
            id: "cotizador",
            title: "Presupuestador",
            icon: "⚡",
            desc: "Crea cotizaciones profesionales en PDF en minutos.",
            status: "active", // Este será el primero que haremos
            action: onOpenCotizador
        },
        {
            id: "clientes",
            title: "Gestión de Clientes",
            icon: "👥",
            desc: "Base de datos de tus clientes, historial y deudas.",
            status: "coming",
            action: () => alert("Módulo de Clientes en construcción"),
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

            {/* GRILLA DE HERRAMIENTAS */}
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
