import Header from "@/components/header";
import AdminDashboardNew from "@/components/admin-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import styles from "./admin-page.module.css";

export default function AdminPage(): JSX.Element {
    const { user, isLoading } = useAuth();
    const [, setLocation] = useLocation();

    // If user is loading, show loading indicator
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingSpinner} />
            </div>
        );
    }

    // Redirect non-admin users to the home page
    if (user && user.role !== "admin") {
        setLocation("/");
        return <></>;
    }

    return (
        <div className={styles.adminPage}>
            <Header />

            <main className={styles.mainContent}>
                <AdminDashboardNew />
            </main>
        </div>
    );
}
