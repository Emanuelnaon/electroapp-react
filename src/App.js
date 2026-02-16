import React, { useState, useEffect } from "react";
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
import Cotizador from "./Cotizador";
import Clientes from "./Clientes";
import DashboardHome from "./DashboardHome"; // Importamos el dashboard que arreglamos antes

const ADMIN_EMAIL = "emanuelnaon@gmail.com";

function App() {
    // ESTADOS
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [showSuperAdminPanel, setShowSuperAdminPanel] = useState(false);

    // ✅ CORREGIDO AQUÍ: Definimos currentView y setCurrentView
    const [currentView, setCurrentView] = useState("dashboard");

    // Estado para modo oscuro
    const [darkMode, setDarkMode] = useState(false);

    // EFECTO: MODO OSCURO
    useEffect(() => {
        if (darkMode) {
            document.body.setAttribute("data-theme", "dark");
        } else {
            document.body.removeAttribute("data-theme");
        }
    }, [darkMode]);

    // EFECTO: AUTENTICACIÓN
    useEffect(() => {
        // Detectar si entra por /admin
        if (window.location.pathname === "/admin") {
            setShowLogin(true);
        }

        // Verificar sesión actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Escuchar cambios de sesión
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            // Redirigir si se loguea en /admin
            if (session?.user && window.location.pathname === "/admin") {
                window.location.href = "/";
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // FUNCIÓN LOGOUT
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setCurrentView("dashboard"); // Volver al inicio al salir
    };

    // LÓGICA PARA MOSTRAR CONTENIDO (ROUTER INTERNO)
    const renderDashboard = () => {
        const isSuperAdmin = user?.email === ADMIN_EMAIL;

        // 1. Si eligió COTIZADOR
        if (currentView === "cotizador") {
            return <Cotizador onBack={() => setCurrentView("dashboard")} />;
        }

        // 2. Si eligió CLIENTES
        if (currentView === "clientes") {
            return <Clientes onBack={() => setCurrentView("dashboard")} />;
        }

        // 3. Si eligió ADMIN PANEL (Solo Super Admin)
        if (isSuperAdmin && showSuperAdminPanel) {
            return (
                <div className={styles.adminSection}>
                    <button
                        onClick={() => setShowSuperAdminPanel(false)}
                        style={{
                            marginBottom: "20px",
                            cursor: "pointer",
                            padding: "10px",
                        }}
                    >
                        ← Volver al Menú
                    </button>
                    <EmailDashboard />
                </div>
            );
        }

        // 4. POR DEFECTO: MOSTRAR EL MENÚ PRINCIPAL (DashboardHome)
        return (
            <DashboardHome
                user={user}
                isSuperAdmin={isSuperAdmin}
                onOpenWaitlist={() => setShowSuperAdminPanel(true)}
                onOpenCotizador={() => setCurrentView("cotizador")}
                onOpenClientes={() => setCurrentView("clientes")} // Conectamos el botón
            />
        );
    };

    // RENDERIZADO PRINCIPAL
    if (loading) {
        return <div className={styles.loading}>Cargando...</div>;
    }

    // PANTALLA DE LOGIN (/admin)
    if (showLogin && !user) {
        return <LoginScreen onLoginSuccess={(user) => setUser(user)} />;
    }

    // PANTALLA PÚBLICA (LANDING PAGE - NO LOGUEADO)
    if (!user) {
        return (
            <div>
                <Header
                    titulo="ElectroApp"
                    subtitulo="Un sistema de gestión gratis para electricistas."
                    darkMode={darkMode}
                    toggleDarkMode={() => setDarkMode(!darkMode)}
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

    // PANTALLA PRIVADA (DASHBOARD - LOGUEADO)
    return (
        <>
            <Header
                titulo="ElectroApp"
                subtitulo="Panel de Gestión Profesional"
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
            />

            <main className={styles.main}>
                <div className={`${styles.sessionBar} no-print-global`}>
                    <span>
                        👤 Sesión: <strong>{user.email}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {renderDashboard()}
            </main>

            <Footer />
            <ScrollToTop />
            <Toaster position="top-right" />
        </>
    );
}

export default App;
