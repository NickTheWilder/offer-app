import type { JSX } from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuctionItems, deleteAuctionItem } from "@/services/graphql-api";
import styles from "./admin-dashboard.module.css";
import type { AuctionItem } from "../types/schema";
import { AddNewItemForm } from "./add-new-item-form";
import { BidDashboard } from "./bid-dashboard";
import { UserDashboard } from "./user-dashboard";
import { ReportDashboard } from "./report.dashboard";

export default function AdminDashboard(): JSX.Element {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeAdminTab, setActiveAdminTab] = useState("items");
    const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
    const [newItemMode, setNewItemMode] = useState(false);

    // Fetch auction items
    const { data: items, isLoading } = useQuery<AuctionItem[]>({
        queryKey: ["/api/items"],
        queryFn: async () => {
            return await getAuctionItems();
        },
    });

    // Delete item mutation
    const deleteItemMutation = useMutation({
        mutationFn: async (id: number) => {
            // TODO: Update deleteAuctionItem to accept id parameter
            console.log("Delete item with id:", id);
            return await deleteAuctionItem();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/items"] });
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            if (selectedItem) {
                setSelectedItem(null);
            }
            toast({
                title: "Success",
                description: "Item deleted successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete item",
                variant: "destructive",
            });
        },
    });

    // Format currency
    const formatCurrency = (amount: number | null) => {
        if (amount === null) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Handle new item
    const handleAddItem = () => {
        setSelectedItem(null);
        setNewItemMode(true);
    };

    // Handle edit item
    const handleEditItem = (item: AuctionItem) => {
        setSelectedItem(item);
        setNewItemMode(false);
    };

    // Handle item deletion
    const handleDeleteItem = (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            deleteItemMutation.mutate(id);
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
                                                    <div className={styles.itemImage}>{item.images && item.images.length > 0 ? <img src={item.images[0]} alt={item.name} /> : <div className={styles.noImage}>No Image</div>}</div>
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
                                <AddNewItemForm
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
                                        <button className={styles.addButton} onClick={handleAddItem}>
                                            <PlusCircle className={styles.plusIcon} />
                                            Add New Item
                                        </button>
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
