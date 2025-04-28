import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";
import styles from "./protected-route.module.css";

export function ProtectedRoute({ component: Component }: { component: React.ComponentType }): JSX.Element {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingSpinner} />
            </div>
        );
    }

    if (!user) {
        return <Redirect to="/auth" />;
    }

    return <Component />;
}
