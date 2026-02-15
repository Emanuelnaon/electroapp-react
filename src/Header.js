import styles from "./Header.module.css";

function Header({ titulo, subtitulo, user, onLogout }) {
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
                {user ? (
                    /* Si está logueado */
                    <div className={styles.userMenu}>
                        <span className={styles.userBadge}>
                            {/* Aquí luego mostraremos el rol real desde Supabase */}
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
                        {/* Puedes agregar más links aquí en el futuro como 'Precios', 'Contacto' */}
                        <a href="#beneficios" className={styles.navLink}>
                        </a>

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
