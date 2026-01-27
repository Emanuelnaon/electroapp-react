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
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios en la autenticación
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

  // Si NO está logueado, mostrar pantalla de login
  if (!user) {
    return <LoginScreen onLoginSuccess={(user) => setUser(user)} />;
  }

  // Si está logueado, mostrar la app normal
  return (
    <div>
      <Header 
        titulo="ElectroApp" 
        subtitulo="Un sistema de gestión gratis para electricistas."
      />
      
      <main className={styles.main}>
        {/* Barra de sesión activa */}
        <div className={styles.sessionBar}>
          <span>👤 Sesión activa: <strong>{user.email}</strong></span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>

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

        {/* Dashboard solo visible si está logueado */}
        <EmailDashboard />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;