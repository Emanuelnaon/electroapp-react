import { useState } from 'react';
import styles from './WaitlistForm.module.css';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Regex para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validación de formato
    if (!email || !emailRegex.test(email)) {
      setMessage('❌ Por favor ingresá un email válido (ej: juan@gmail.com)');
      setMessageType('error');
      return;
    }
    
    // Verificar duplicados
    if (emails.includes(email)) {
      setMessage('📧 Este email ya está en la lista de espera');
      setMessageType('error');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // Guardar email
    setEmails([...emails, email]);
    setMessage('✅ ¡Listo! Te avisaremos cuando esté listo');
    setMessageType('success');
    setEmail('');
    
    setTimeout(() => setMessage(''), 3000);
  };
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Próximamente</h2>
      
      <p className={styles.description}>
        Dejá tu email para ser de los primeros en probarlo:
      </p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className={styles.input}
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          title="Ingresá un email válido (ej: juan@gmail.com)"
          required
        />
        
        <button type="submit" className={styles.button}>
          Unirme a la lista
        </button>
      </form>
      
      {message && (
        <div className={`${styles.message} ${
          messageType === 'success' ? styles.messageSuccess : styles.messageError
        }`}>
          {message}
        </div>
      )}
      
      <p className={styles.counter}>
        {emails.length} electricista{emails.length !== 1 ? 's' : ''} ya se anotaron
      </p>
    </div>
  );
}

export default WaitlistForm;