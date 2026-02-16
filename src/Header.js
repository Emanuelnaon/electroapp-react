import React from "react";
import styles from "./Header.module.css";

// 1. AQUI AGREGAMOS "darkMode" y "toggleDarkMode"
function Header({
    titulo,
    subtitulo,
    user,
    onLogout,
    darkMode,
    toggleDarkMode,
}) {
    return (
        <header className={styles.header}>
            {/* LADO IZQUIERDO: LOGO Y TÍTULO */}
            <div className={styles.logoContainer}>
                <div className={styles.logoCircle}>⚡</div>
                <div className={styles.brandInfo}>
                    <h1 className={styles.title}>{titulo}</h1>
                    {subtitulo && (
                        <p className={styles.subtitle}>{subtitulo}</p>
                    )}
                </div>
            </div>

            {/* LADO DERECHO: NAVBAR */}
            <nav className={styles.navBar}>
                {/* 2. BOTÓN SOL/LUNA (Con estilo seguro) */}
                <button
                    onClick={toggleDarkMode}
                    title="Cambiar Modo"
                    style={{
                        background: "transparent",
                        border: "1px solid #333",
                        borderRadius: "50px",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        padding: "5px 10px",
                        marginRight: "10px",
                        display: "flex",
                        alignItems: "center",
                        color: "#FFD700", // Amarillo para que combine
                    }}
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>

                {user ? (
                    /* Si está logueado */
                    <div className={styles.userMenu}>
                        <span className={styles.userBadge}>
                            👤 {user.email.split("@")[0]}
                        </span>
                        <button
                            onClick={onLogout}
                            className={styles.navLinkLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    /* Si NO está logueado */
                    <div className={styles.publicMenu}>
                        {/* Texto para evitar error de accesibilidad
                        <a href="#beneficios" className={styles.navLink}>
                            Beneficios
                        </a> */}

                        <button
                            onClick={() => (window.location.href = "/admin")}
                            className={styles.electricianButton}
                        >
                            👷 Electricistas
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;
