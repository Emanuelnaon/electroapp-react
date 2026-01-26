import './App.css';
import Header from './Header';
import Footer from './Footer';
import BenefitCard from './BenefitCard';
import WaitlistForm from './WaitlistForm';

function App() {
  return (
    <div>
      <Header 
        titulo="ElectroApp" 
        subtitulo="La app para electricistas que simplifica tu trabajo"
      />
      
      <main style={{ 
        maxWidth: '800px', 
        margin: '20px auto', 
        padding: '0 20px', 
        backgroundColor: '#f0f4f8',
      }}>
        <h2>¿Por qué ElectroApp?</h2>
        <BenefitCard 
          emoji="📋" 
          titulo="Presupuestos Rápidos" 
          descripcion="Genera presupuestos detallados en minutos." 
        />
        <BenefitCard 
          emoji="👥" 
          titulo="Gestión de Clientes" 
          descripcion="Administra tus clientes desde un solo lugar." 
        />
        <BenefitCard 
          emoji="📱" 
          titulo="Acceso Multiplataforma" 
          descripcion="Gestiona desde cualquier dispositivo." 
        />
        <BenefitCard 
          emoji="🌐" 
          titulo="Perfil Publico" 
          descripcion="Mostra tu trabajo con tu perfil público y lista de precios personalizados." 
        />

        <WaitlistForm />  
      </main>
      
      <Footer />
    </div>
  );
}

export default App;