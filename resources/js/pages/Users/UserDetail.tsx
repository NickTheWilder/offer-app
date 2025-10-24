import { type JSX, useState, useEffect, FormEvent } from "react";
import { Head, router } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import UserHeader from "@/components/UserDetail/UserHeader";
import Tabs from "@/components/ui/Tabs";
import UserInfoView from "@/components/UserDetail/UserInfoView";
import UserEditForm from "@/components/UserDetail/UserEditForm";
import PlaceholderTab from "@/components/ui/PlaceholderTab";
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

        router.put(`/admin/users/${user.id}`, formData, {
            onSuccess: () => {
                setIsEditing(false);
                setIsSaving(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSaving(false);
            },
        });
    };

    const assignBidderNumber = () => {
        router.put(
            `/admin/users/${user.id}/assign-bidder-number`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const updatedUser = page.props.user as User;
                    setFormData({ ...formData, bidder_number: updatedUser.bidder_number as string });
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
                        <UserHeader user={user} />

                        {/* Flash Messages */}
                        {flash?.success && <div className={styles.flashSuccess}>{flash.success}</div>}
                        {flash?.error && <div className={styles.flashError}>{flash.error}</div>}

                        <Tabs
                            items={[
                                { key: "info", label: "User Information" },
                                { key: "bids", label: "Bids" },
                                { key: "sales", label: "Sales" },
                                { key: "activity", label: "Activity" },
                            ]}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {/* Tab Content */}
                        <div className={styles.tabContent}>
                            {activeTab === "info" && (
                                <div className={styles.infoTab}>
                                    {!isEditing ? (
                                        <UserInfoView user={user} onEdit={() => setIsEditing(true)} />
                                    ) : (
                                        <UserEditForm
                                            formData={formData}
                                            errors={errors}
                                            isSaving={isSaving}
                                            onSubmit={handleSubmit}
                                            onCancel={handleCancel}
                                            onFieldChange={(field, value) => setFormData({ ...formData, [field]: value })}
                                            onAssignBidderNumber={assignBidderNumber}
                                        />
                                    )}
                                </div>
                            )}

                            {activeTab === "bids" && (
                                <PlaceholderTab
                                    title="Bid History"
                                    description="View and manage all bids placed by this user."
                                />
                            )}

                            {activeTab === "sales" && (
                                <PlaceholderTab
                                    title="Sales & Transactions"
                                    description="Track sales and payment information for this user."
                                />
                            )}

                            {activeTab === "activity" && (
                                <PlaceholderTab
                                    title="Activity Log"
                                    description="View this user's activity history and timeline."
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
