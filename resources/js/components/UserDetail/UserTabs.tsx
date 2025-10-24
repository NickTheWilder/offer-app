import type { JSX } from "react";
import styles from "./UserTabs.module.css";

type TabType = "info" | "bids" | "sales" | "activity";

interface UserTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function UserTabs({ activeTab, onTabChange }: UserTabsProps): JSX.Element {
    return (
        <div className={styles.tabs}>
            <button
                className={`${styles.tab} ${activeTab === "info" ? styles.activeTab : ""}`}
                onClick={() => onTabChange("info")}
            >
                User Information
            </button>
            <button
                className={`${styles.tab} ${activeTab === "bids" ? styles.activeTab : ""}`}
                onClick={() => onTabChange("bids")}
            >
                Bids
            </button>
            <button
                className={`${styles.tab} ${activeTab === "sales" ? styles.activeTab : ""}`}
                onClick={() => onTabChange("sales")}
            >
                Sales
            </button>
            <button
                className={`${styles.tab} ${activeTab === "activity" ? styles.activeTab : ""}`}
                onClick={() => onTabChange("activity")}
            >
                Activity
            </button>
        </div>
    );
}