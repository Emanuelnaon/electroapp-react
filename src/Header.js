import React from "react";
import styles from "./Header.module.css";

function Header({ title, user, onLogout, onBack, darkMode, toggleDarkMode }) {
    return (
        <header className={styles.header}>
            {/* SECCIÓN IZQUIERDA (Botón Volver o Logo) */}
            <div className={styles.leftSection}>
                {onBack ? (
                    <button onClick={onBack} className={styles.backButton}>
                        ← Volver
                    </button>
                ) : (
                    <div className={styles.logoCircle}>⚡</div>
                )}
            </div>

            {/* SECCIÓN CENTRAL (Título Absoluto) */}
            <div className={styles.centerSection}>
                <h1 className={styles.title}>{title}</h1>
            </div>

            {/* SECCIÓN DERECHA (Controles) */}
            <div className={styles.rightSection}>
                {/* Botón Luna/Sol */}
                <button
                    onClick={toggleDarkMode}
                    className={styles.themeToggle}
                    title={darkMode ? "Modo Claro" : "Modo Oscuro"}
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>

                {/* Usuario y Logout (Solo si está logueado) */}
                {user && (
                    <div className={styles.userInfo}>
                        <span className={styles.userBadge}>
                            {user.email.split("@")[0]}
                        </span>
                        <button onClick={onLogout} className={styles.logoutBtn}>
                            Salir
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
