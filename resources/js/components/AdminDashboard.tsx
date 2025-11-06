import { type JSX, useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import styles from "./AdminDashboard.module.css";
import Tabs from "./ui/Tabs";
import { SystemDashboard } from "./AdminDashboard/SystemDashboard";
import { ReportDashboard } from "./AdminDashboard/ReportDashboard";
import { UserGrid } from "./AdminDashboard/UserGrid";
import { BidsGrid } from "./AdminDashboard/BidsGrid";
import ItemDashboard from "./AdminDashboard/ItemDashboard";
import type { AuctionItem, User, Bid } from "@/types";
import { fetchAdminData } from "@/utils/adminApi";

interface LoadingState {
    items: boolean;
    users: boolean;
    reports: boolean;
    bids: boolean;
}

interface DataState {
    items: AuctionItem[] | null;
    users: User[] | null;
    reports: unknown[] | null;
    bids: Bid[] | null;
}

export default function AdminDashboard(): JSX.Element {
    // Check for tab query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get("tab") || "items";

    const [activeAdminTab, setActiveAdminTab] = useState(initialTab);
    const [loading, setLoading] = useState<LoadingState>({
        items: false,
        users: false,
        reports: false,
        bids: false,
    });
    const [data, setData] = useState<DataState>({
        items: null,
        users: null,
        reports: null,
        bids: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Data fetching functions using the utility
    const fetchItems = useCallback(async () => {
        await fetchAdminData({
            type: "items",
            currentData: data.items,
            isLoading: loading.items,
            setLoading: (isLoading) => setLoading((prev) => ({ ...prev, items: isLoading })),
            setData: (items) => setData((prev) => ({ ...prev, items })),
            setError: (error) => setErrors((prev) => ({ ...prev, items: error })),
        });

        // Also fetch users when fetching items for the donor dropdown
        if (!data.users && !loading.users) {
            await fetchAdminData({
                type: "users",
                currentData: data.users,
                isLoading: loading.users,
                setLoading: (isLoading) => setLoading((prev) => ({ ...prev, users: isLoading })),
                setData: (users) => setData((prev) => ({ ...prev, users })),
                setError: (error) => setErrors((prev) => ({ ...prev, users: error })),
            });
        }
    }, [data.items, data.users, loading.items, loading.users]);

    const fetchUsers = useCallback(async () => {
        await fetchAdminData({
            type: "users",
            currentData: data.users,
            isLoading: loading.users,
            setLoading: (isLoading) => setLoading((prev) => ({ ...prev, users: isLoading })),
            setData: (users) => setData((prev) => ({ ...prev, users })),
            setError: (error) => setErrors((prev) => ({ ...prev, users: error })),
        });
    }, [data.users, loading.users]);

    const fetchReports = useCallback(async () => {
        await fetchAdminData({
            type: "reports",
            currentData: data.reports,
            isLoading: loading.reports,
            setLoading: (isLoading) => setLoading((prev) => ({ ...prev, reports: isLoading })),
            setData: (reports) => setData((prev) => ({ ...prev, reports })),
            setError: (error) => setErrors((prev) => ({ ...prev, reports: error })),
        });
    }, [data.reports, loading.reports]);

    const fetchBids = useCallback(async () => {
        await fetchAdminData({
            type: "bids",
            currentData: data.bids,
            isLoading: loading.bids,
            setLoading: (isLoading) => setLoading((prev) => ({ ...prev, bids: isLoading })),
            setData: (bids) => setData((prev) => ({ ...prev, bids })),
            setError: (error) => setErrors((prev) => ({ ...prev, bids: error })),
        });
    }, [data.bids, loading.bids]);

    // Handle tab changes with data fetching
    const handleTabChange = useCallback(
        async (tab: string) => {
            setActiveAdminTab(tab);

            if (window.location.search) {
                window.history.replaceState({}, "", "/admin");
            }

            switch (tab) {
                case "items":
                    await fetchItems();
                    break;
                case "users":
                    await fetchUsers();
                    break;
                case "bids":
                    await fetchBids();
                    break;
                case "reports":
                    await fetchReports();
                    break;
                case "system":
                    // System settings don't need data fetching
                    break;
            }
        },
        [fetchItems, fetchUsers, fetchBids, fetchReports]
    );

    // First load, fetch data based on initial tab
    useEffect(() => {
        switch (initialTab) {
            case "items":
                fetchItems();
                break;
            case "users":
                fetchUsers();
                break;
            case "bids":
                fetchBids();
                break;
            case "reports":
                fetchReports();
                break;
            case "system":
                // System settings don't need data fetching
                break;
            default:
                fetchItems();
        }
    }, [initialTab, fetchItems, fetchUsers, fetchBids, fetchReports]);

    return (
        <div className={styles.adminLayout}>
            <Tabs
                items={[
                    { key: "items", label: "Items" },
                    { key: "users", label: "Users" },
                    { key: "bids", label: "Bids" },
                    { key: "reports", label: "Reports" },
                    { key: "system", label: "System" },
                ]}
                activeTab={activeAdminTab}
                onTabChange={handleTabChange}
            />

            {/* Main content area */}
            <div className={styles.adminContent}>
                {activeAdminTab === "items" ? (
                    <>
                        {loading.items ? (
                            <div className={styles.loadingContainer}>
                                <Loader2 className={styles.loadingSpinner} />
                                <p>Loading items...</p>
                            </div>
                        ) : errors.items ? (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorText}>Error: {errors.items}</p>
                                <button
                                    onClick={fetchItems}
                                    className={styles.retryButton}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <ItemDashboard
                                items={data.items || []}
                                users={data.users || []}
                                onItemsUpdate={(updatedItems) => setData((prev) => ({ ...prev, items: updatedItems }))}
                            />
                        )}
                    </>
                ) : activeAdminTab === "users" ? (
                    <>
                        {loading.users ? (
                            <div className={styles.loadingContainer}>
                                <Loader2 className={styles.loadingSpinner} />
                                <p>Loading users...</p>
                            </div>
                        ) : errors.users ? (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorText}>Error: {errors.users}</p>
                                <button
                                    onClick={fetchUsers}
                                    className={styles.retryButton}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <UserGrid users={data.users || []} />
                        )}
                    </>
                ) : activeAdminTab === "bids" ? (
                    <>
                        {loading.bids ? (
                            <div className={styles.loadingContainer}>
                                <Loader2 className={styles.loadingSpinner} />
                                <p>Loading bids...</p>
                            </div>
                        ) : errors.bids ? (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorText}>Error: {errors.bids}</p>
                                <button
                                    onClick={fetchBids}
                                    className={styles.retryButton}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <BidsGrid bids={data.bids || []} />
                        )}
                    </>
                ) : activeAdminTab === "system" ? (
                    <SystemDashboard />
                ) : (
                    <>
                        {loading.reports ? (
                            <div className={styles.loadingContainer}>
                                <Loader2 className={styles.loadingSpinner} />
                                <p>Loading reports...</p>
                            </div>
                        ) : errors.reports ? (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorText}>Error: {errors.reports}</p>
                                <button
                                    onClick={fetchReports}
                                    className={styles.retryButton}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <ReportDashboard />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
