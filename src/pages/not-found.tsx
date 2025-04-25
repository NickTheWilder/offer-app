import { AlertCircle } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.headerContainer}>
            <AlertCircle className={styles.icon} />
            <h1 className={styles.title}>404 Page Not Found</h1>
          </div>

          <p className={styles.message}>
            Did you forget to add the page to the router?
          </p>
        </div>
      </div>
    </div>
  );
}
