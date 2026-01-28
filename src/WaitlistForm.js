import { useState, useEffect } from 'react';
import styles from './WaitlistForm.module.css';
import { supabase } from './supabaseClient';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState(0);

  // Función para obtener el contador
  const fetchCount = async () => {
    const { count: currentCount, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      setCount(currentCount || 0);
    }
  };

  // useEffect inicial
  useEffect(() => {
    fetchCount();

    // 🆕 SUBSCRIPTION A CAMBIOS EN TIEMPO REAL
    const channel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'waitlist'
        },
        (payload) => {
          console.log('🔴 Nuevo email registrado:', payload.new.email);
          
          // Actualizar contador automáticamente
          setCount(prevCount => prevCount + 1);
          
          // Opcional: Mostrar notificación
          if (Notification.permission === 'granted') {
            new Notification('ElectroApp', {
              body: `Nuevo registro: ${payload.new.email}`,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .subscribe();

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ email: email }])
        .select();
     
      console.log('Data insertada:', data); // ← Usar la variable

      if (error) {
        if (error.code === '23505') {
          alert('Este email ya está registrado');
        } else {
          alert('Error al guardar. Intenta de nuevo.');
        }
        return;
      }

      setSuccess(true);
      setEmail('');
      
      // Ya no necesitamos actualizar el count manualmente
      // El subscription lo hace automáticamente

      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.waitlistSection}>
      <h2>Próximamente</h2>
      <p className={styles.description}>Dejá tu email para ser de los primeros en probarlo:</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={loading}
          className={styles.input}
        />
        <button 
          type="submit" 
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Guardando...' : 'Unirme a la lista de espera'}
        </button>
      </form>

      {success && (
        <div className={styles.success}>
          ✅ ¡Listo! Te avisaremos cuando esté disponible.
        </div>
      )}

      <p className={styles.counter}>
        <strong>{count}</strong> electricistas ya se anotaron
      </p>
    </section>
  );
}

export default WaitlistForm;