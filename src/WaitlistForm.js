import { useState, useEffect } from 'react';
import styles from './WaitlistForm.module.css';
import { supabase } from './supabaseClient';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [emailCount, setEmailCount] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Contar emails al cargar
  useEffect(() => {
    async function fetchEmailCount() {
      try {
        const { count, error } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        setEmailCount(count || 0);
      } catch (error) {
        console.error('Error al contar emails:', error);
      }
    }
    
    fetchEmailCount();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      setMessage('❌ Por favor ingresá un email válido (ej: juan@gmail.com)');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ email: email }])
        .select();
      
      if (error) {
        if (error.code === '23505') {
          setMessage('📧 Este email ya está en la lista de espera');
          setMessageType('error');
        } else {
          setMessage('❌ Error al guardar. Intentá de nuevo.');
          setMessageType('error');
          console.error('Error de Supabase:', error);
        }
        return;
      }
      
      setEmail('');
      setMessage('✅ ¡Listo! Te avisaremos cuando esté listo');
      setMessageType('success');
      setEmailCount(emailCount + 1);
      
      console.log('✅ Email guardado:', data);
      
    } catch (error) {
      setMessage('❌ Error inesperado. Intentá de nuevo.');
      setMessageType('error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
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
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className={styles.input}
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          title="Ingresá un email válido (ej: juan@gmail.com)"
          required
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Unirme a la lista'}
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
        {emailCount} electricista{emailCount !== 1 ? 's' : ''} ya se anotaron
      </p>
    </div>
  );
}

export default WaitlistForm;