import { useState } from 'react';

function WaitlistForm() {
  // Estado para el email que el usuario escribe
  const [email, setEmail] = useState('');
  
  // Estado para la lista de emails guardados
  const [emails, setEmails] = useState([]);
  
  // Estado para mostrar mensajes
  const [message, setMessage] = useState('');
  
  // Función que se ejecuta cuando se envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar recarga de página
    
    // Validación básica
    if (!email || !email.includes('@')) {
      setMessage('❌ Por favor ingresá un email válido');
      return;
    }
    
    // Verificar duplicados
    if (emails.includes(email)) {
      setMessage('📧 Este email ya está en la lista');
      setEmail(''); // Limpiar input
      return;
    }
    
    // Agregar email a la lista
    setEmails([...emails, email]);
    
    // Mostrar mensaje de éxito
    setMessage('✅ ¡Listo! Te avisaremos cuando esté listo');
    
    // Limpiar input
    setEmail('');
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '40px auto'
    }}>
      <h2 style={{ textAlign: 'center', color: '#007acc', marginBottom: '20px' }}>
        Próximamente
      </h2>
      
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#4a5568' }}>
        Dejá tu email para ser de los primeros en probarlo:
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px'
            }}
            required
          />
          
          <button 
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Unirme
          </button>
        </div>
      </form>
      
      {/* Mensaje de éxito/error */}
      {message && (
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: message.includes('✅') ? '#d1fae5' : '#fed7d7',
          color: message.includes('✅') ? '#065f46' : '#991b1b',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          {message}
        </div>
      )}
      
      {/* Contador */}
      <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#007acc' }}>
        {emails.length} electricista{emails.length !== 1 ? 's' : ''} ya se anotaron
      </p>
    </div>
  );
}

export default WaitlistForm;