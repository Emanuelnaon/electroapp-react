import { useState, useEffect } from 'react';
import styles from './EmailDashboard.module.css';
import { supabase } from './supabaseClient';

function EmailDashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Función para cargar emails
  const fetchEmails = async () => {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar emails:', error);
    } else {
      setEmails(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails();

    // 🆕 SUBSCRIPTION A CAMBIOS EN TIEMPO REAL
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escucha INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'waitlist'
        },
        (payload) => {
          console.log('🔴 Cambio detectado:', payload);

          if (payload.eventType === 'INSERT') {
            // Agregar nuevo email al inicio de la lista
            setEmails(prevEmails => [payload.new, ...prevEmails]);
          } else if (payload.eventType === 'DELETE') {
            // Remover email de la lista
            setEmails(prevEmails => 
              prevEmails.filter(email => email.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            // Actualizar email en la lista
            setEmails(prevEmails =>
              prevEmails.map(email =>
                email.id === payload.new.id ? payload.new : email
              )
            );
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtrado de emails
  const filteredEmails = emails.filter(item => {
    if (filterDays === 'all') return true;

    const emailDate = new Date(item.created_at);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(filterDays));

    return emailDate >= daysAgo;
  });

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copiar al clipboard
  const copyToClipboard = async (email, id) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'Fecha de Registro'];
    const rows = filteredEmails.map(item => [
      item.id,
      item.email,
      formatDate(item.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `electroapp-emails-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando emails...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📊 Dashboard de Emails</h2>
        <div className={styles.stats}>
          <span className={styles.badge}>
            Total: {filteredEmails.length}
            {filterDays !== 'all' && ` (últimos ${filterDays} días)`}
          </span>
          <button onClick={exportToCSV} className={styles.exportButton}>
            📥 Exportar CSV
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          onClick={() => setFilterDays('all')}
          className={`${styles.filterButton} ${filterDays === 'all' ? styles.active : ''}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterDays('7')}
          className={`${styles.filterButton} ${filterDays === '7' ? styles.active : ''}`}
        >
          Últimos 7 días
        </button>
        <button
          onClick={() => setFilterDays('30')}
          className={`${styles.filterButton} ${filterDays === '30' ? styles.active : ''}`}
        >
          Últimos 30 días
        </button>
      </div>

      {filteredEmails.length === 0 ? (
        <div className={styles.empty}>
          No hay emails en este rango de fechas
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((item) => (
                <tr key={item.id}>
                  <td className={styles.emailCell}>{item.email}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    <button
                      onClick={() => copyToClipboard(item.email, item.id)}
                      className={styles.copyButton}
                    >
                      {copiedId === item.id ? '✅ Copiado' : '📋 Copiar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmailDashboard;