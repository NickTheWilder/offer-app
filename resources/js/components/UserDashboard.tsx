import React, { type JSX } from "react";
import styles from "./admin-dashboard.module.css";

export function UserDashboard(): JSX.Element {
    return (
        <div className={styles.placeholderTab}>
            <h3 className={styles.placeholderTitle}>User Management</h3>
            <p className={styles.placeholderText}>Manage user accounts and permissions.</p>
        </div>
    );
}
