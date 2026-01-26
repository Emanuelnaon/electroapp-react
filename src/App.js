import styles from './App.module.css';
import Header from './Header';
import Footer from './Footer';
import BenefitCard from './BenefitCard';
import WaitlistForm from './WaitlistForm';
import TestSupabase from './TestSupabase'; 

function App() {
  return (
    <div>
      <Header 
        titulo="ElectroApp" 
        subtitulo="Un sistema de gestión gratis para electricistas."
      />
      
      <TestSupabase />
      
      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>
          ¿Por qué ElectroApp?
        </h2>
        
        <div className={styles.benefitsGrid}>
          <BenefitCard 
            emoji="📋"
            titulo="Presupuestos Rápidos"
            descripcion="Armá presupuestos profesionales en menos de 3 minutos con precios actualizados"
          />
          
          <BenefitCard 
            emoji="👥"
            titulo="Gestión de Clientes"
            descripcion="Seguimiento completo de trabajos, pagos y comunicaciones en un solo lugar"
          />
          
          <BenefitCard 
            emoji="📱"
            titulo="Acceso Multiplataforma"
            descripcion="Gestiona tus presupuestos desde cualquier dispositivo: PC, tablet o celular"
          />
          
          <BenefitCard 
            emoji="🌐"
            titulo="Perfil Público"
            descripcion="Mostrá tu trabajo con tu perfil público y lista de precios personalizada"
          />
        </div>
        
        <WaitlistForm />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;