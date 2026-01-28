import { useState } from 'react';
import { supabase } from './supabaseClient';
import styles from './LoginScreen.module.css';

function LoginScreen({ onLoginSuccess, inline = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      console.log('✅ Login exitoso:', data.user.email);
      
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={inline ? styles.inlineContainer : styles.container}>
      <div className={styles.loginBox}>
        {!inline && (
          <>
            <h1 className={styles.title}>⚡ ElectroApp Admin</h1>
            <p className={styles.subtitle}>Iniciar sesión</p>
          </>
        )}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@electroapp.com"
              required
              autoComplete="email"
              disabled={loading}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={loading}
              className={styles.input}
            />
          </div>

          {error && (
            <div className={styles.error}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {!inline && (
          <p className={styles.footer}>
            Solo para administradores de ElectroApp
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
