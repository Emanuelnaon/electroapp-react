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
import DashboardHome from "./DashboardHome";
import Historial from "./Historial";

const ADMIN_EMAIL = "emanuelnaon@gmail.com";

function App() {
    // ESTADOS
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [showSuperAdminPanel, setShowSuperAdminPanel] = useState(false);
    const [currentView, setCurrentView] = useState("dashboard");
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
        if (window.location.pathname === "/admin") {
            setShowLogin(true);
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
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
        setCurrentView("dashboard");
        setShowSuperAdminPanel(false);
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
                    title="ElectroApp" // Usamos "title" con el nuevo Header
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

    // ==========================================
    // LÓGICA DE PANTALLA PRIVADA (LOGUEADO)
    // ==========================================

    const isSuperAdmin = user?.email === ADMIN_EMAIL;

    // 1. Configuramos dinámicamente qué Título y qué Botón de Volver mostrar en el Header
    let headerTitle = "Panel de Control";
    let handleBack = null; // Si es null, el Header muestra el Logo

    if (showSuperAdminPanel) {
        headerTitle = "Panel de Super Admin";
        handleBack = () => setShowSuperAdminPanel(false);
    } else if (currentView === "cotizador") {
        headerTitle = "Nuevo Presupuesto";
        handleBack = () => setCurrentView("dashboard");
    } else if (currentView === "clientes") {
        headerTitle = "Cartera de Clientes";
        handleBack = () => setCurrentView("dashboard");
    } else if (currentView === "historial") {
        headerTitle = "Historial de Presupuestos";
        handleBack = () => setCurrentView("dashboard");
    }

    // 2. Renderizamos solo el "Cuerpo" de la vista actual
    const renderDashboardContent = () => {
        if (isSuperAdmin && showSuperAdminPanel) {
            return (
                <div className={styles.adminSection}>
                    <EmailDashboard />
                </div>
            );
        }
        if (currentView === "cotizador") return <Cotizador />;
        if (currentView === "clientes") return <Clientes />;
        if (currentView === "historial") return <Historial />;

        return (
            <DashboardHome
                user={user}
                isSuperAdmin={isSuperAdmin}
                onOpenWaitlist={() => setShowSuperAdminPanel(true)}
                onOpenCotizador={() => setCurrentView("cotizador")}
                onOpenClientes={() => setCurrentView("clientes")}
                onOpenHistorial={() => setCurrentView("historial")}
            />
        );
    };

    return (
        <>
            {/* UN SOLO HEADER INTELIGENTE PARA TODO */}
            <Header
                title={headerTitle}
                user={user}
                onLogout={handleLogout}
                onBack={handleBack}
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
            />

            <main className={styles.main}>{renderDashboardContent()}</main>

            <Footer />
            <ScrollToTop />
            <Toaster position="top-right" />
        </>
    );
}

export default App;
