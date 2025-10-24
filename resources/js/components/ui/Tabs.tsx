import type { JSX } from "react";
import styles from "./Tabs.module.css";

export interface TabItem {
    key: string;
    label: string;
    disabled?: boolean;
    badge?: string;
}

interface TabsProps {
    items: TabItem[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    className?: string;
}

export default function Tabs({ items, activeTab, onTabChange, className }: TabsProps): JSX.Element {
    return (
        <div className={`${styles.tabs} ${className || ""}`}>
            {items.map((item) => (
                <button
                    key={item.key}
                    className={`${styles.tab} ${activeTab === item.key ? styles.activeTab : ""}`}
                    onClick={() => onTabChange(item.key)}
                    disabled={item.disabled}
                >
                    {item.label}
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                </button>
            ))}
        </div>
    );
}