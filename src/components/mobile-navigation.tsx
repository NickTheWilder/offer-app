import { Search, Gavel } from "lucide-react";
import styles from "./mobile-navigation.module.css";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  return (
    <div className={styles.navigationContainer}>
      <div className={styles.navigationBar}>
        <button
          onClick={() => onTabChange("bidderDashboard")}
          className={`${styles.tabButton} ${activeTab === "bidderDashboard" ? styles.active : ""}`}
        >
          <Search className={styles.tabIcon} />
          <span className={styles.tabLabel}>Browse</span>
        </button>
        
        <button
          onClick={() => onTabChange("myBids")}
          className={`${styles.tabButton} ${activeTab === "myBids" ? styles.active : ""}`}
        >
          <Gavel className={styles.tabIcon} />
          <span className={styles.tabLabel}>My Bids</span>
        </button>
      </div>
    </div>
  );
}
