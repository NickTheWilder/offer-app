import React, { type JSX, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";
import type { PageProps, AuctionItem } from "@/types";
import styles from "./admin-page.module.css";

type AdminPageProps = PageProps<{
    auctionItems: AuctionItem[];
}>;

export default function AdminPage({ auth, auctionItems }: AdminPageProps): JSX.Element {
    // Redirect non-admin users to the home page
    useEffect(() => {
        if (auth.user && auth.user.role !== "admin") {
            router.visit("/");
        }
    }, [auth.user]);

    // If user is not admin, show loading while redirecting
    if (auth.user && auth.user.role !== "admin") {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingSpinner} />
            </div>
        );
    }

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className={styles.adminPage}>
                <Header user={auth.user} />

                <main className={styles.mainContent}>
                    <AdminDashboard items={auctionItems} />
                </main>
            </div>
        </>
    );
}
