import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import styles from "./protected-route.module.css";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType;
}) {
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
