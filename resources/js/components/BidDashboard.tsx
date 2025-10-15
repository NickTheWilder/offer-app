import React, { type JSX } from "react";
import styles from "./admin-dashboard.module.css";

export function BidDashboard(): JSX.Element {
    return (
        <div className={styles.placeholderTab}>
            <h3 className={styles.placeholderTitle}>Bid Management</h3>
            <p className={styles.placeholderText}>View and manage all bids across auction items.</p>
        </div>
    );
}
