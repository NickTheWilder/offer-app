import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import type { AuctionItem, User } from "@/types";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { type JSX, useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import { AuctionItemForm } from "./AuctionItemForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ItemDashboardProps {
    items: AuctionItem[];
    users: User[];
    onItemsUpdate?: (items: AuctionItem[]) => void;
}

export default function ItemDashboard({ items, users, onItemsUpdate }: ItemDashboardProps): JSX.Element {
    const { toast } = useToast();
    const [localItems, setLocalItems] = useState<AuctionItem[]>(items);
    const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
    const [newItemMode, setNewItemMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<AuctionItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Update local items when props change
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

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

    // Handle delete button click
    const handleDeleteClick = (item: AuctionItem) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    // Handle confirmed deletion
    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        try {
            await fetch(`/auction-items/${itemToDelete.id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
            });

            // Update local items state
            const newItems = localItems.filter((item) => item.id !== itemToDelete.id);
            setLocalItems(newItems);

            // Clear selection if deleted item was selected
            if (selectedItem?.id === itemToDelete.id) {
                setSelectedItem(null);
                setNewItemMode(false);
            }

            onItemsUpdate?.(newItems);

            toast({
                title: "Item deleted",
                description: `"${itemToDelete.name}" has been deleted successfully.`,
            });
        } catch (error: unknown) {
            console.error("Failed to delete auction item", error);
            toast({
                title: "Error",
                description: "Failed to delete auction item",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    // Handle delete modal close
    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    // Handle form success
    const handleFormSuccess = (updatedItem: AuctionItem) => {
        if (newItemMode) {
            // Adding new item
            const newItems = [...localItems, updatedItem];
            setLocalItems(newItems);
            setSelectedItem(updatedItem);
            setNewItemMode(false);
            onItemsUpdate?.(newItems);
        } else {
            // Updating existing item
            const newItems = localItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
            setLocalItems(newItems);
            setSelectedItem(updatedItem);
            onItemsUpdate?.(newItems);
        }

        toast({
            title: newItemMode ? "Item created" : "Item updated",
            description: `"${updatedItem.name}" has been ${newItemMode ? "created" : "updated"} successfully.`,
        });
    };

    return (
        <div className={styles.adminLayout}>
            <div className={styles.adminContent}>
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
                            {!localItems || localItems.length === 0 ? (
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
                                    {localItems.map((item) => (
                                        <div key={item.id} className={`${styles.itemCard} ${selectedItem?.id === item.id ? styles.selectedCard : ""}`} onClick={() => handleEditItem(item)}>
                                            <div className={styles.itemCardContent}>
                                                <div className={styles.itemImage}>{item.files && item.files.length > 0 ? <img src={item.files[0]?.url || ""} alt={item.name} /> : <div className={styles.noImage}>No Image</div>}</div>
                                                <div className={styles.itemInfo}>
                                                    <h3 className={styles.itemName}>{item.name}</h3>
                                                    <p className={styles.itemPrice}>{formatCurrency(item.starting_bid)}</p>
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
                                                        handleDeleteClick(item);
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
                            <AuctionItemForm key={selectedItem?.id || "new"} selectedItem={selectedItem} users={users} onSuccess={handleFormSuccess} />
                        ) : (
                            <div className={styles.noSelection}>
                                <div className={styles.noSelectionContent}>
                                    <h3 className={styles.noSelectionTitle}>No Item Selected</h3>
                                    <p className={styles.noSelectionText}>Select an item from the list or add a new one to get started.</p>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
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
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Auction Item"
                message="Are you sure you want to delete this auction item? This action cannot be undone and will remove all associated bids."
                itemName={itemToDelete?.name}
                isLoading={isDeleting}
            />
        </div>
    );
}
