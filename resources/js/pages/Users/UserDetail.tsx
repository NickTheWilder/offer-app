import { type JSX, useState, useEffect, FormEvent } from "react";
import { Head, router } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import type { PageProps, User } from "@/types";
import styles from "./UserDetail.module.css";

type UserDetailProps = PageProps<{
    user: User;
}>;

type TabType = "info" | "bids" | "sales" | "activity";

export default function UserDetail({ auth, user, flash }: UserDetailProps): JSX.Element {
    // Check if we should start in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const startInEditMode = urlParams.get("edit") === "true";

    const [activeTab, setActiveTab] = useState<TabType>("info");
    const [isEditing, setIsEditing] = useState(startInEditMode);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
        bidder_number: user.bidder_number || "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Redirect non-admin users
    useEffect(() => {
        if (auth.user && auth.user.role !== "admin") {
            router.visit("/");
        }
    }, [auth.user]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({});

        router.put(
            `/admin/users/${user.id}`,
            formData,
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setIsSaving(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setIsSaving(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            role: user.role,
            bidder_number: user.bidder_number || "",
        });
        setErrors({});
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (auth.user && auth.user.role !== "admin") {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingSpinner} />
            </div>
        );
    }

    return (
        <>
            <Head title={`User: ${user.name}`} />
            <div className={styles.userDetailPage}>
                <Header user={auth.user} />

                <main className={styles.mainContent}>
                    <div className={styles.container}>
                        {/* Header with Back Button */}
                        <div className={styles.pageHeader}>
                            <button
                                className={styles.backButton}
                                onClick={() => router.visit("/admin?tab=users")}
                            >
                                <svg
                                    className={styles.backIcon}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back to Users
                            </button>
                            <div className={styles.pageTitle}>
                                <h1>{user.name}</h1>
                                <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className={styles.flashSuccess}>
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className={styles.flashError}>
                                {flash.error}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === "info" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("info")}
                            >
                                User Information
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === "bids" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("bids")}
                            >
                                Bids
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === "sales" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("sales")}
                            >
                                Sales
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === "activity" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("activity")}
                            >
                                Activity
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className={styles.tabContent}>
                            {activeTab === "info" && (
                                <div className={styles.infoTab}>
                                    {!isEditing ? (
                                        <div className={styles.viewMode}>
                                            <div className={styles.viewHeader}>
                                                <h2>User Details</h2>
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    <svg
                                                        className={styles.editIcon}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                    Edit User
                                                </button>
                                            </div>

                                            <div className={styles.detailsGrid}>
                                                <div className={styles.detailItem}>
                                                    <label>Name</label>
                                                    <div className={styles.detailValue}>{user.name}</div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Email</label>
                                                    <div className={styles.detailValue}>{user.email}</div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Phone</label>
                                                    <div className={styles.detailValue}>
                                                        {user.phone || <span className={styles.emptyValue}>Not provided</span>}
                                                    </div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Address</label>
                                                    <div className={styles.detailValue}>
                                                        {user.address || <span className={styles.emptyValue}>Not provided</span>}
                                                    </div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Role</label>
                                                    <div className={styles.detailValue}>
                                                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Bidder Number</label>
                                                    <div className={styles.detailValue}>
                                                        {user.bidder_number || <span className={styles.emptyValue}>Not assigned</span>}
                                                    </div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Member Since</label>
                                                    <div className={styles.detailValue}>{formatDate(user.created_at)}</div>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <label>Last Updated</label>
                                                    <div className={styles.detailValue}>{formatDate(user.updated_at)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className={styles.editForm}>
                                            <div className={styles.formHeader}>
                                                <h2>Edit User</h2>
                                            </div>

                                            <div className={styles.formGrid}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="name">
                                                        Name <span className={styles.required}>*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        className={styles.formInput}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                    />
                                                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="email">
                                                        Email <span className={styles.required}>*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        className={styles.formInput}
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                    />
                                                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="phone">Phone</label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        className={styles.formInput}
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="address">Address</label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        className={styles.formInput}
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    />
                                                    {errors.address && <span className={styles.error}>{errors.address}</span>}
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="role">
                                                        Role <span className={styles.required}>*</span>
                                                    </label>
                                                    <select
                                                        id="role"
                                                        className={styles.formInput}
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "bidder" })}
                                                        required
                                                    >
                                                        <option value="bidder">Bidder</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    {errors.role && <span className={styles.error}>{errors.role}</span>}
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label htmlFor="bidder_number">Bidder Number</label>
                                                    <input
                                                        type="text"
                                                        id="bidder_number"
                                                        className={styles.formInput}
                                                        value={formData.bidder_number}
                                                        onChange={(e) => setFormData({ ...formData, bidder_number: e.target.value })}
                                                    />
                                                    {errors.bidder_number && <span className={styles.error}>{errors.bidder_number}</span>}
                                                </div>
                                            </div>

                                            <div className={styles.formActions}>
                                                <button
                                                    type="button"
                                                    className={styles.cancelButton}
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className={styles.saveButton}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <Loader2 className={styles.spinner} />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                className={styles.saveIcon}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}

                            {activeTab === "bids" && (
                                <div className={styles.placeholderTab}>
                                    <h3>Bid History</h3>
                                    <p>View and manage all bids placed by this user.</p>
                                </div>
                            )}

                            {activeTab === "sales" && (
                                <div className={styles.placeholderTab}>
                                    <h3>Sales & Transactions</h3>
                                    <p>Track sales and payment information for this user.</p>
                                </div>
                            )}

                            {activeTab === "activity" && (
                                <div className={styles.placeholderTab}>
                                    <h3>Activity Log</h3>
                                    <p>View this user&apos;s activity history and timeline.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
