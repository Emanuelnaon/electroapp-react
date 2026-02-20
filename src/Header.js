import React from "react";
import styles from "./Header.module.css";

function Header({
    title,
    subtitle,
    user,
    onLogout,
    onBack,
    darkMode,
    toggleDarkMode,
}) {
    return (
        <header className={styles.header}>
            {/* IZQUIERDA: Botón ESC/Volver o Logo */}
            <div className={styles.leftSection}>
                {onBack ? (
                    <button onClick={onBack} className={styles.backButton}>
                        ← ESC / Volver
                    </button>
                ) : (
                    <div className={styles.logoCircle}>⚡</div>
                )}
            </div>

            {/* CENTRO: Título Fijo y Subtítulo Dinámico */}
            <div className={styles.centerSection}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && (
                    <span className={styles.subtitle}>{subtitle}</span>
                )}
            </div>

            {/* DERECHA: Dark Mode y Salir */}
            <div className={styles.rightSection}>
                <button
                    onClick={toggleDarkMode}
                    className={styles.themeToggle}
                    title={darkMode ? "Modo Claro" : "Modo Oscuro"}
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>

                {user && (
                    <button onClick={onLogout} className={styles.logoutBtn}>
                        Cerrar Sesión
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
