import { type JSX, useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ItemDashboard from "@/components/AdminDashboard/ItemDashboard";
import type { PageProps, AuctionItem, User } from "@/types";
import styles from "./AdminPage.module.css";

type ItemPageProps = PageProps<{
    auctionItems: AuctionItem[];
    users: User[];
}>;

export default function ItemPage({ auth, auctionItems, users }: ItemPageProps): JSX.Element {
    const [localAuctionItems, setLocalAuctionItems] = useState<AuctionItem[]>(auctionItems);

    // Update local items when props change
    useEffect(() => {
        setLocalAuctionItems(auctionItems);
    }, [auctionItems]);
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
            <Head title="Item Dashboard" />
            <div className={styles.adminPage}>
                <Header user={auth.user} />

                <main className={styles.mainContent}>
                    <ItemDashboard
                        items={localAuctionItems}
                        users={users}
                        onItemsUpdate={setLocalAuctionItems}
                    />
                </main>
            </div>
        </>
    );
}
