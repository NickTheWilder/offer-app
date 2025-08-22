import type { JSX } from "react";
import styles from "./admin-dashboard.module.css";

export function ReportDashboard(): JSX.Element {
    return (
        <div className={styles.placeholderTab}>
            <h3 className={styles.placeholderTitle}>Reports</h3>
            <p className={styles.placeholderText}>Generate and view auction reports.</p>
        </div>
    );
}
