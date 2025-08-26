import type { JSX } from "react";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import styles from "./admin-dashboard.module.css";
import { UserDashboard } from "./user-dashboard";
import { ReportDashboard } from "./report.dashboard";
import { AuctionItemForm } from "./auction-item-form";
import { BidDashboard } from "./bid-dashboard";
import { GET_AUCTION_ITEMS } from "@/lib/graphql-queries";
import type { AuctionItemFragment } from "@/types/generated/graphql";
import { formatCurrency } from "@/utils";

export default function AdminDashboard(): JSX.Element {
    const { toast } = useToast();
    const [activeAdminTab, setActiveAdminTab] = useState("items");
    const [selectedItem, setSelectedItem] = useState<AuctionItemFragment | null>(null);
    const [newItemMode, setNewItemMode] = useState(false);

    // Fetch auction items using Apollo Client
    const { data, loading: isLoading } = useQuery<{auctionItems: AuctionItemFragment[]}>(GET_AUCTION_ITEMS, {
        errorPolicy: 'all',
        onError: (error) => {
            console.error("GraphQL query error:", error);
            toast({
                title: "Error loading items",
                description: error.message || "Failed to load auction items",
                variant: "destructive",
            });
        }
    });

    const items = data?.auctionItems || [];

    // Handle new item
    const handleAddItem = () => {
        setSelectedItem(null);
        setNewItemMode(true);
    };

    // Handle edit item
    const handleEditItem = (item: AuctionItemFragment) => {
        setSelectedItem(item);
        setNewItemMode(false);
    };

    // Handle item deletion
    const handleDeleteItem = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            // TODO: Implement delete mutation
            console.log("Delete item with id:", id);
            toast({
                title: "Not implemented",
                description: "Delete functionality will be added later",
                variant: "destructive",
            });
        }
    };

    return (
        <div className={styles.adminLayout}>
            {/* Admin Tabs */}
            <div className={styles.tabsList}>
                <button onClick={() => setActiveAdminTab("items")} className={`${styles.tabTrigger} ${activeAdminTab === "items" ? styles.active : ""}`}>
                    Items
                </button>
                <button onClick={() => setActiveAdminTab("bids")} className={`${styles.tabTrigger} ${activeAdminTab === "bids" ? styles.active : ""}`}>
                    Bids
                </button>
                <button onClick={() => setActiveAdminTab("users")} className={`${styles.tabTrigger} ${activeAdminTab === "users" ? styles.active : ""}`}>
                    Users
                </button>
                <button onClick={() => setActiveAdminTab("reports")} className={`${styles.tabTrigger} ${activeAdminTab === "reports" ? styles.active : ""}`}>
                    Reports
                </button>
            </div>

            {/* Main content area */}
            <div className={styles.adminContent}>
                {activeAdminTab === "items" ? (
                    <div className={styles.splitLayout}>
                        {/* Sidebar - Item List */}
                        <div className={styles.sidebar}>
                            <div className={styles.sidebarHeader}>
                                <h2 className={styles.sidebarTitle}>Auction Items</h2>
                                <button className={styles.addButton} onClick={handleAddItem}>
                                    <PlusCircle className={styles.plusIcon} />
                                    Add New
                                </button>
                            </div>

                            <div className={styles.itemList}>
                                {isLoading ? (
                                    <div className={styles.loadingContainer}>
                                        <Loader2 className={styles.spinnerIcon} />
                                    </div>
                                ) : !items || items.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIconContainer}>
                                            <PlusCircle className={styles.emptyIcon} />
                                        </div>
                                        <p className={styles.emptyText}>No auction items yet</p>
                                        <button className={styles.addButton} onClick={handleAddItem}>
                                            Add New Item
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {items.map((item) => (
                                            <div key={item.id} className={`${styles.itemCard} ${selectedItem?.id === item.id ? styles.selectedCard : ""}`} onClick={() => handleEditItem(item)}>
                                                <div className={styles.itemCardContent}>
                                                    <div className={styles.itemImage}>{item.imageURL ? <img src={item.imageURL} alt={item.name} /> : <div className={styles.noImage}>No Image</div>}</div>
                                                    <div className={styles.itemInfo}>
                                                        <h3 className={styles.itemName}>{item.name}</h3>
                                                        <p className={styles.itemPrice}>{formatCurrency(item.startingBid)}</p>
                                                    </div>
                                                </div>
                                                <div className={styles.itemActions}>
                                                    <button
                                                        className={styles.editButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditItem(item);
                                                        }}
                                                    >
                                                        <Edit className={styles.actionIcon} />
                                                    </button>
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteItem(item.id);
                                                        }}
                                                    >
                                                        <Trash2 className={styles.actionIcon} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Main content - Item Form */}
                        <div className={styles.mainContent}>
                            {selectedItem || newItemMode ? (
                                <AuctionItemForm
                                    key={selectedItem?.id || 'new'}
                                    selectedItem={selectedItem}
                                    onSuccess={() => {
                                        setSelectedItem(null);
                                        setNewItemMode(false);
                                    }}
                                />
                            ) : (
                                <div className={styles.noSelection}>
                                    <div className={styles.noSelectionContent}>
                                        <h3 className={styles.noSelectionTitle}>No Item Selected</h3>
                                        <p className={styles.noSelectionText}>Select an item from the list or add a new one to get started.</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <button className={styles.addButton} onClick={handleAddItem}>
                                                <PlusCircle className={styles.plusIcon} />
                                                Add New Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeAdminTab === "bids" ? (
                    <BidDashboard />
                ) : activeAdminTab === "users" ? (
                    <UserDashboard />
                ) : (
                    <ReportDashboard />
                )}
            </div>
        </div>
    );
}
