import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import styles from './EmailDashboard.module.css';

function EmailDashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [filterDays, setFilterDays] = useState('all');

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data);
    } catch (error) {
      console.error('Error al cargar emails:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredEmails = () => {
    if (filterDays === 'all') return emails;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(filterDays));
    return emails.filter(item => {
      const emailDate = new Date(item.created_at);
      return emailDate >= daysAgo;
    });
  };

  const filteredEmails = getFilteredEmails();

  // --- FUNCIÓN DE EXPORTACIÓN ---
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

  if (loading) return <div className={styles.container}><div className={styles.loading}>Cargando...</div></div>;
  if (error) return <div className={styles.container}><div className={styles.error}>Error: {error}</div></div>;

  return (
    <div className={styles.container}>
      {/* HEADER ACTUALIZADO CON BOTÓN EXPORTAR */}
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

      {/* FILTROS */}
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

      {/* TABLA */}
      {filteredEmails.length === 0 ? (
        <div className={styles.empty}>
          No hay emails en este rango de fechas
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((item) => (
                <tr key={item.id}>
                  <td className={styles.idCell}>{item.id}</td>
                  <td className={styles.emailCell}>{item.email}</td>
                  <td className={styles.dateCell}>
                    {formatDate(item.created_at)}
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => copyToClipboard(item.email, item.id)}
                      className={styles.copyButton}
                    >
                      {copiedId === item.id ? '✅' : '📋'}
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