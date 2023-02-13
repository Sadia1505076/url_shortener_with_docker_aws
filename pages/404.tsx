import Link from 'next/link';
import styles from '@/styles/Error.module.css'

export default function NotFound() {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.textCenter}>
        <h1>
          <span className={styles.fadeIn} id="digit1">4</span>
          <span className={styles.fadeIn} id="digit2">0</span>
          <span className={styles.fadeIn} id="digit3">4</span>
        </h1>
        <h3 className={styles.fadeI}>PAGE NOT FOUND</h3>
        <Link
          href="/"
          className="button"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
