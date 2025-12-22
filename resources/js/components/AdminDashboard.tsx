import { type JSX, useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import styles from "./AdminDashboard.module.css";
import Tabs from "./ui/Tabs";
import { SystemDashboard } from "./AdminDashboard/SystemDashboard";
import { ReportDashboard } from "./AdminDashboard/ReportDashboard";
import { UserGrid } from "./AdminDashboard/UserGrid";
import { SalesGrid } from "./AdminDashboard/SalesGrid";
import ItemDashboard from "./AdminDashboard/ItemDashboard";
import type { AuctionItem, User, Sale } from "@/types";
import { fetchAdminData } from "@/utils/adminApi";

interface LoadingState {
    items: boolean;
    users: boolean;
    reports: boolean;
    sales: boolean;
}

interface DataState {
    items: AuctionItem[] | null;
    users: User[] | null;
    reports: unknown[] | null;
    sales: Sale[] | null;
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
        sales: false,
    });
    const [data, setData] = useState<DataState>({
        items: null,
        users: null,
        reports: null,
        sales: null,
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

    const fetchSales = useCallback(async () => {
        await fetchAdminData({
            type: "sales",
            currentData: data.sales,
            isLoading: loading.sales,
            setLoading: (isLoading) => setLoading((prev) => ({ ...prev, sales: isLoading })),
            setData: (sales) => setData((prev) => ({ ...prev, sales })),
            setError: (error) => setErrors((prev) => ({ ...prev, sales: error })),
        });
    }, [data.sales, loading.sales]);

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
                case "sales":
                    await fetchSales();
                    break;
                case "reports":
                    await fetchReports();
                    break;
                case "system":
                    // System settings don't need data fetching
                    break;
            }
        },
        [fetchItems, fetchUsers, fetchSales, fetchReports]
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
            case "sales":
                fetchSales();
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
    }, [initialTab, fetchItems, fetchUsers, fetchSales, fetchReports]);

    return (
        <div className={styles.adminLayout}>
            <Tabs
                items={[
                    { key: "items", label: "Items" },
                    { key: "users", label: "Users" },
                    { key: "sales", label: "Sales" },
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
                ) : activeAdminTab === "sales" ? (
                    <>
                        {loading.sales ? (
                            <div className={styles.loadingContainer}>
                                <Loader2 className={styles.loadingSpinner} />
                                <p>Loading sales...</p>
                            </div>
                        ) : errors.sales ? (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorText}>Error: {errors.sales}</p>
                                <button
                                    onClick={fetchSales}
                                    className={styles.retryButton}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <SalesGrid sales={data.sales || []} />
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
