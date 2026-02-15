import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './EmailDashboard.module.css';
import { supabase } from './supabaseClient';

function EmailDashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 10;

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

    // Subscription a cambios en tiempo real
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist'
        },
        (payload) => {
          console.log('🔴 Cambio detectado:', payload);

          if (payload.eventType === 'INSERT') {
            setEmails(prevEmails => [payload.new, ...prevEmails]);
          } else if (payload.eventType === 'DELETE') {
            setEmails(prevEmails => 
              prevEmails.filter(email => email.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setEmails(prevEmails =>
              prevEmails.map(email =>
                email.id === payload.new.id ? payload.new : email
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtrado por fecha
  const filterByDate = (items) => {
    if (filterDays === 'all') return items;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(filterDays));

    return items.filter(item => {
      const emailDate = new Date(item.created_at);
      return emailDate >= daysAgo;
    });
  };

  // Filtrado por búsqueda
  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    
    return items.filter(item =>
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Aplicar todos los filtros
  const filteredEmails = filterBySearch(filterByDate(emails));

  // Paginación
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDays, searchTerm]);

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
    toast.success('Email copiado al portapapeles'); // ← AGREGAR
    setTimeout(() => setCopiedId(null), 2000);
  } catch (err) {
    console.error('Error al copiar:', err);
    toast.error('Error al copiar'); // ← AGREGAR
  }
};

  // Eliminar email
const handleDelete = async (id, email) => {
  // Confirmación con toast personalizado
  toast((t) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <strong>¿Eliminar este email?</strong>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
          {email}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            toast.loading('Eliminando...');
            
            try {
              const { error } = await supabase
                .from('waitlist')
                .delete()
                .eq('id', id);

              if (error) {
                toast.dismiss();
                toast.error('Error al eliminar');
                console.error(error);
              } else {
                toast.dismiss();
                toast.success('Email eliminado correctamente');
                console.log('✅ Email eliminado:', email);
              }
            } catch (err) {
              toast.dismiss();
              toast.error('Error al eliminar');
              console.error('Error:', err);
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Eliminar
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  ), {
    duration: Infinity, // No se cierra automáticamente
    position: 'top-center',
  });
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

      {/* Barra de búsqueda */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Buscar por email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={styles.clearButton}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros por fecha */}
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
          {searchTerm 
            ? `No se encontraron emails con "${searchTerm}"`
            : 'No hay emails en este rango de fechas'
          }
        </div>
      ) : (
        <>
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
                {currentEmails.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.emailCell}>{item.email}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => copyToClipboard(item.email, item.id)}
                        className={styles.copyButton}
                        title="Copiar email"
                      >
                        {copiedId === item.id ? '✅' : '📋'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.email)}
                        className={styles.deleteButton}
                        title="Eliminar email"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                ← Anterior
              </button>

              <span className={styles.pageInfo}>
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EmailDashboard;
