import type { JSX } from "react";
import { AlertCircle } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound(): JSX.Element {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <div className={styles.headerContainer}>
                        <AlertCircle className={styles.icon} />
                        <h1 className={styles.title}>404 Page Not Found</h1>
                    </div>

                    <p className={styles.message}>Looks like you're not supposed to be here. If you believe this is a mistake please contact your support representative.</p>
                </div>
            </div>
        </div>
    );
}
