import styles from './App.module.css';
import Header from './Header';
import Footer from './Footer';
import BenefitCard from './BenefitCard';
import WaitlistForm from './WaitlistForm';
import EmailDashboard from './EmailDashboard';

function App() {
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

        <EmailDashboard />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;