import { type JSX, useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import styles from "./AdminDashboard.module.css";
import { DonorDashboard } from "./DonorDashboard";
import { ReportDashboard } from "./ReportDashboard";
import { UserDashboard } from "./UserDashboard";
import ItemDashboard from "./ItemDashboard";
import type { AuctionItem, User } from "@/types";
import { fetchAdminData } from "@/utils/adminApi";

interface LoadingState {
    items: boolean;
    donors: boolean;
    users: boolean;
    reports: boolean;
}

interface DataState {
    items: AuctionItem[] | null;
    donors: unknown[] | null;
    users: User[] | null;
    reports: unknown[] | null;
}

export default function AdminDashboard(): JSX.Element {
    // Check for tab query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get("tab") || "items";

    const [activeAdminTab, setActiveAdminTab] = useState(initialTab);
    const [loading, setLoading] = useState<LoadingState>({
        items: false,
        donors: false,
        users: false,
        reports: false,
    });
    const [data, setData] = useState<DataState>({
        items: null,
        donors: null,
        users: null,
        reports: null,
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

    const fetchDonors = useCallback(async () => {
        await fetchAdminData({
            type: "donors",
            currentData: data.donors,
            isLoading: loading.donors,
            setLoading: (isLoading) => setLoading((prev) => ({ ...prev, donors: isLoading })),
            setData: (donors) => setData((prev) => ({ ...prev, donors })),
            setError: (error) => setErrors((prev) => ({ ...prev, donors: error })),
        });
    }, [data.donors, loading.donors]);

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
                case "donors":
                    await fetchDonors();
                    break;
                case "users":
                    await fetchUsers();
                    break;
                case "reports":
                    await fetchReports();
                    break;
            }
        },
        [fetchItems, fetchDonors, fetchUsers, fetchReports]
    );

    // First load, fetch data based on initial tab
    useEffect(() => {
        switch (initialTab) {
            case "items":
                fetchItems();
                break;
            case "donors":
                fetchDonors();
                break;
            case "users":
                fetchUsers();
                break;
            case "reports":
                fetchReports();
                break;
            default:
                fetchItems();
        }
    }, [initialTab, fetchItems, fetchDonors, fetchUsers, fetchReports]);

    return (
        <div className={styles.adminLayout}>
            {/* Admin Tabs */}
            <div className={styles.tabsList}>
                <button onClick={() => handleTabChange("items")} className={`${styles.tabTrigger} ${activeAdminTab === "items" ? styles.active : ""}`}>
                    Items
                </button>
                <button onClick={() => handleTabChange("donors")} className={`${styles.tabTrigger} ${activeAdminTab === "donors" ? styles.active : ""}`}>
                    Donors
                </button>
                <button onClick={() => handleTabChange("users")} className={`${styles.tabTrigger} ${activeAdminTab === "users" ? styles.active : ""}`}>
                    Users
                </button>
                <button onClick={() => handleTabChange("reports")} className={`${styles.tabTrigger} ${activeAdminTab === "reports" ? styles.active : ""}`}>
                    Reports
                </button>
            </div>

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
                                <button onClick={fetchItems} className={styles.retryButton}>
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <ItemDashboard 
                                items={data.items || []} 
                                users={data.users || []} 
                                onItemsUpdate={(updatedItems) => setData(prev => ({ ...prev, items: updatedItems }))}
                            />
                        )}
                    </>
                ) : activeAdminTab === "donors" ? (
                    <>
                        {loading.donors ? (
                            <div className={styles.loadingContainer}>
                                <Loader2 className={styles.loadingSpinner} />
                                <p>Loading donors...</p>
                            </div>
                        ) : errors.donors ? (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorText}>Error: {errors.donors}</p>
                                <button onClick={fetchDonors} className={styles.retryButton}>
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <DonorDashboard />
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
                                <button onClick={fetchUsers} className={styles.retryButton}>
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <UserDashboard users={data.users || []} />
                        )}
                    </>
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
                                <button onClick={fetchReports} className={styles.retryButton}>
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
