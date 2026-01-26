import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        © 2026 ElectroApp - Hecho por electricistas, para electricistas
      </p>
    </footer>
  );
}

export default Footer;