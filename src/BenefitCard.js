import styles from './BenefitCard.module.css';

function BenefitCard({ emoji, titulo, descripcion }) {
  return (
    <div className={styles.card}>
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.title}>{titulo}</h3>
      <p className={styles.description}>{descripcion}</p>
    </div>
  );
}

export default BenefitCard;