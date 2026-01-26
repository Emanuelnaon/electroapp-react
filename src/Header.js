import styles from './Header.module.css';

function Header({ titulo = "ElectroApp", subtitulo = "Sistema de gestión" }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>⚡ {titulo}</h1>
      <p className={styles.subtitle}>{subtitulo}</p>
    </header>
  );
}

export default Header;