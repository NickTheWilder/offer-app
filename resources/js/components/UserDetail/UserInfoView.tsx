import type { JSX } from "react";
import type { User } from "@/types";
import { formatDate } from "@/lib/utils";
import styles from "./UserInfoView.module.css";

interface UserInfoViewProps {
    user: User;
    onEdit: () => void;
}

export default function UserInfoView({ user, onEdit }: UserInfoViewProps): JSX.Element {
    return (
        <div className={styles.viewMode}>
            <div className={styles.viewHeader}>
                <h2>User Details</h2>
                <button
                    className={styles.editButton}
                    onClick={onEdit}
                >
                    <svg
                        className={styles.editIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    Edit User
                </button>
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <label>Name</label>
                    <div className={styles.detailValue}>{user.name}</div>
                </div>
                <div className={styles.detailItem}>
                    <label>Email</label>
                    <div className={styles.detailValue}>{user.email}</div>
                </div>
                <div className={styles.detailItem}>
                    <label>Phone</label>
                    <div className={styles.detailValue}>
                        {user.phone || <span className={styles.emptyValue}>Not provided</span>}
                    </div>
                </div>
                <div className={styles.detailItem}>
                    <label>Address</label>
                    <div className={styles.detailValue}>
                        {user.address || <span className={styles.emptyValue}>Not provided</span>}
                    </div>
                </div>
                <div className={styles.detailItem}>
                    <label>Role</label>
                    <div className={styles.detailValue}>
                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>{user.role}</span>
                    </div>
                </div>
                <div className={styles.detailItem}>
                    <label>Bidder Number</label>
                    <div className={styles.detailValue}>
                        {user.bidder_number || <span className={styles.emptyValue}>Not assigned</span>}
                    </div>
                </div>
                <div className={styles.detailItem}>
                    <label>Member Since</label>
                    <div className={styles.detailValue}>{formatDate(user.created_at)}</div>
                </div>
                <div className={styles.detailItem}>
                    <label>Last Updated</label>
                    <div className={styles.detailValue}>{formatDate(user.updated_at)}</div>
                </div>
            </div>
        </div>
    );
}
