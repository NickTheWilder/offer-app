import { type JSX } from "react";
import styles from "./AdminDashboard.module.css";

export function DonorDashboard(): JSX.Element {
    return (
        <div className={styles.placeholderTab}>
            <h3 className={styles.placeholderTitle}>Donor Management</h3>
            <p className={styles.placeholderText}>View and manage all donors.</p>
        </div>
    );
}
