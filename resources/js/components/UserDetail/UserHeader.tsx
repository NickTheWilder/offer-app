import type { JSX } from "react";
import { router } from "@inertiajs/react";
import type { User } from "@/types";
import styles from "./UserHeader.module.css";

interface UserHeaderProps {
    user: User;
}

export default function UserHeader({ user }: UserHeaderProps): JSX.Element {
    return (
        <div className={styles.pageHeader}>
            <button
                className={styles.backButton}
                onClick={() => router.visit("/admin?tab=users")}
            >
                <svg
                    className={styles.backIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Users
            </button>
            <div className={styles.pageTitle}>
                <h1>{user.name}</h1>
                <span className={`${styles.roleBadge} ${styles[user.role]}`}>{user.role}</span>
            </div>
        </div>
    );
}
