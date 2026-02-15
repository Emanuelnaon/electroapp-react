import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./App.module.css";
import Header from "./Header";
import Footer from "./Footer";
import BenefitCard from "./BenefitCard";
import WaitlistForm from "./WaitlistForm";
import EmailDashboard from "./EmailDashboard";
import LoginScreen from "./LoginScreen";
import { supabase } from "./supabaseClient";
import ScrollToTop from "./ScrollToTop";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        // Detectar si está en /admin
        if (window.location.pathname === "/admin") {
            setShowLogin(true);
        }

        // Verificar sesión
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Escuchar cambios en auth
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);

            // Si se loguea estando en /admin, redirigir a home
            if (session?.user && window.location.pathname === "/admin") {
                window.location.href = "/";
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Función de logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    // ===== PANTALLA DE LOADING =====
    if (loading) {
        return <div className={styles.loading}>Cargando...</div>;
    }

    // ===== PANTALLA DE LOGIN (/admin sin loguearse) =====
    if (showLogin && !user) {
        return <LoginScreen onLoginSuccess={(user) => setUser(user)} />;
    }

    // ===== VISTA PÚBLICA (sin login) =====
    if (!user) {
        return (
            <div>
                <Header
                    titulo="ElectroApp"
                    subtitulo="Un sistema de gestión gratis para electricistas."
                />

                <main className={styles.main}>
                    <h2 className={styles.sectionTitle}>
                        ¿Por qué ElectroApp?
                    </h2>

                    <div className={styles.benefitsGrid}>
                        <BenefitCard
                            emoji="📋"
                            titulo="Presupuestos Rápidos"
                            descripcion="Armá presupuestos profesionales en menos de 3 minutos"
                        />

                        <BenefitCard
                            emoji="👥"
                            titulo="Gestión de Clientes"
                            descripcion="Seguimiento completo de trabajos y pagos"
                        />

                        <BenefitCard
                            emoji="📱"
                            titulo="Acceso Multiplataforma"
                            descripcion="Gestiona desde cualquier dispositivo"
                        />

                        <BenefitCard
                            emoji="🌐"
                            titulo="Perfil Público"
                            descripcion="Mostrá tu trabajo y precios"
                        />
                    </div>

                    <WaitlistForm />

                    {/* Mensaje para admins */}
                    <div className={styles.adminPrompt}>
                        <p>🔒 ¿Sos administrador?</p>
                        <button
                            onClick={() => (window.location.href = "/admin")}
                            className={styles.adminButton}
                        >
                            Ir al Panel de Administración
                        </button>
                    </div>
                </main>

                <Footer />
                <Toaster position="top-right" />
            </div>
        );
    }

    // ===== VISTA ADMIN (con login) =====
    return (
        <div>
            <Header
                titulo="ElectroApp"
                subtitulo="Un sistema de gestión gratis para electricistas."
            />

            <main className={styles.main}>
                {/* Barra de sesión */}
                <div className={styles.sessionBar}>
                    <span>
                        👤 Sesión activa: <strong>{user.email}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <h2 className={styles.sectionTitle}>¿Por qué ElectroApp?</h2>

                <div className={styles.benefitsGrid}>
                    <BenefitCard
                        emoji="📋"
                        titulo="Presupuestos Rápidos"
                        descripcion="Armá presupuestos profesionales en menos de 3 minutos"
                    />

                    <BenefitCard
                        emoji="👥"
                        titulo="Gestión de Clientes"
                        descripcion="Seguimiento completo de trabajos y pagos"
                    />

                    <BenefitCard
                        emoji="📱"
                        titulo="Acceso Multiplataforma"
                        descripcion="Gestiona desde cualquier dispositivo"
                    />

                    <BenefitCard
                        emoji="🌐"
                        titulo="Perfil Público"
                        descripcion="Mostrá tu trabajo y precios"
                    />
                </div>

                {!user && (
                    <div className={styles.waitlistSection}>
                        <WaitlistForm />
                    </div>
                )}
                {/* Dashboard SOLO para admins */}
                <div className={styles.divider}></div>

                <div className={styles.adminSection}>
                    <h2 className={styles.adminTitle}>
                        🔒 Sección de Administración
                    </h2>
                    <p className={styles.adminSubtitle}>
                        Solo visible para administradores
                    </p>
                    <EmailDashboard />
                </div>
            </main>

            <Footer />
            <ScrollToTop />
        </div>
    );
}

export default App;
