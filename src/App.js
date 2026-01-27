import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Header from './Header';
import Footer from './Footer';
import BenefitCard from './BenefitCard';
import WaitlistForm from './WaitlistForm';
import EmailDashboard from './EmailDashboard';
import LoginScreen from './LoginScreen';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función para manejar logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Mostrar loading mientras verifica sesión
  if (loading) {
    return (
      <div className={styles.loading}>
        Cargando...
      </div>
    );
  }

  return (
    <div>
      <Header 
        titulo="ElectroApp" 
        subtitulo="Un sistema de gestión gratis para electricistas."
      />
      
      <main className={styles.main}>
        {/* BARRA DE ADMIN (solo si está logueado) */}
        {user && (
          <div className={styles.sessionBar}>
            <span>👤 Sesión activa: <strong>{user.email}</strong></span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* BOTÓN DE LOGIN (solo si NO está logueado) */}
        {!user && (
          <div className={styles.loginPrompt}>
            <p>¿Sos administrador?</p>
            <LoginScreen onLoginSuccess={(user) => setUser(user)} />
          </div>
        )}

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

        {/* DASHBOARD - SOLO VISIBLE PARA ADMINS */}
        {user && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.adminSection}>
              <h2 className={styles.adminTitle}>🔒 Sección de Administración</h2>
              <p className={styles.adminSubtitle}>Solo visible para administradores</p>
              <EmailDashboard />
            </div>
          </>
        )}

        {/* MENSAJE SI NO ESTÁ LOGUEADO */}
        {!user && (
          <div className={styles.publicFooter}>
            <p>💡 ¿Sos administrador? Iniciá sesión arriba para ver el dashboard de emails.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;