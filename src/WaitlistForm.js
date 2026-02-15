import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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

    // 1. VALIDACIÓN ESTRICTA DE EMAIL 🛡️
    // Esta "fórmula mágica" verifica: texto + @ + texto + . + texto (de al menos 2 letras)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error('Por favor, ingresa un email válido (ej: nombre@gmail.com) ⚠️');
      return; // Detiene la función aquí, no envía nada a Supabase
    }
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email }])
        .select();

    if (error) {
      if (error.code === '23505') {
        toast.error('Este email ya está registrado');
    } else {
        toast.error('Error al guardar. Intenta de nuevo.');
     }
       return;
    }

setSuccess(true);
setEmail('');
toast.success('¡Email registrado exitosamente!');

setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar. Intenta de nuevo.');
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