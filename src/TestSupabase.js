import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function TestSupabase() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para leer emails de Supabase
    async function fetchEmails() {
      try {
        // Hacer query a la tabla waitlist
        const { data, error } = await supabase
          .from('waitlist')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ Emails desde Supabase:', data);
        setEmails(data);
      } catch (error) {
        console.error('❌ Error al leer Supabase:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Cargando datos de Supabase...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>📧 Emails desde Supabase</h2>
      <p>Total: {emails.length}</p>
      
      <ul>
        {emails.map((item) => (
          <li key={item.id}>
            <strong>ID:</strong> {item.id} | 
            <strong> Email:</strong> {item.email} | 
            <strong> Fecha:</strong> {new Date(item.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestSupabase;