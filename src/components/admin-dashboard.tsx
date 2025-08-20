import type { JSX } from 'react';
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Loader2, Edit, Trash2, Check, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./admin-dashboard.module.css";
import { getAuctionItems, createAuctionItem, updateAuctionItem, deleteAuctionItem, getItemCategories } from "@/services/api";
import type { AuctionItem } from "../types/schema";

// Item form schema for validation
const itemFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    startingBid: z.coerce.number().min(0.01, "Starting bid must be greater than 0"),
    minimumBidIncrement: z.coerce.number().min(0.01, "Increment must be greater than 0").default(5),
    buyNowPrice: z.coerce.number().min(0.01, "Buy now price must be greater than 0").optional().nullable(),
    estimatedValue: z.coerce.number().min(0.01, "Value must be greater than 0").optional().nullable(),
    category: z.string().min(1, "Category is required"),
    tags: z.array(z.string()).optional(),
    donorName: z.string().optional().nullable(),
    donorPublic: z.boolean().default(false),
    startTime: z.string().optional().nullable(),
    endTime: z.string().optional().nullable(),
    status: z.enum(["draft", "published", "active", "sold", "unsold"]).default("draft"),
    restrictions: z.string().optional().nullable(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

export default function AdminDashboard(): JSX.Element {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeAdminTab, setActiveAdminTab] = useState("items");
    const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
    const [newItemMode, setNewItemMode] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    // Fetch auction items for admin
    const { data: items, isLoading } = useQuery<AuctionItem[]>({
        queryKey: ["/api/items"],
        queryFn: async () => {
            return await getAuctionItems();
        },
    });

    // Fetch categories
    const { data: categories } = useQuery<string[]>({
        queryKey: ["/api/categories"],
        queryFn: async () => {
            return await getItemCategories();
        },
    });

    // Create item mutation
    const createItemMutation = useMutation({
        mutationFn: async (data: ItemFormValues) => {
            const formattedData = {
                ...data,
                images: data.images || [],
                tags: data.tags || [],
                auctionType: "silent" as const,
                displayOrder: 0,
                startTime: data.startTime ? new Date(data.startTime) : null,
                endTime: data.endTime ? new Date(data.endTime) : null,
            };

            return await createAuctionItem(formattedData);
        },
        onSuccess: (newItem) => {
            queryClient.invalidateQueries({ queryKey: ["/api/items"] });
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            setSelectedItem(newItem);
            setNewItemMode(false);
            toast({
                title: "Success",
                description: "Item created successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create item",
                variant: "destructive",
            });
        },
    });

    // Update item mutation
    const updateItemMutation = useMutation({
        mutationFn: async (data: ItemFormValues & { id: number }) => {
            const { id, ...itemData } = data;
            const formattedData = {
                ...itemData,
                images: itemData.images || [],
                tags: itemData.tags || [],
                auctionType: "silent" as const,
                displayOrder: 0,
                startTime: itemData.startTime ? new Date(itemData.startTime) : null,
                endTime: itemData.endTime ? new Date(itemData.endTime) : null,
            };

            return await updateAuctionItem(id, formattedData);
        },
        onSuccess: (updatedItem) => {
            queryClient.invalidateQueries({ queryKey: ["/api/items"] });
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            setSelectedItem(updatedItem);
            toast({
                title: "Success",
                description: "Item updated successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update item",
                variant: "destructive",
            });
        },
    });

    // Delete item mutation
    const deleteItemMutation = useMutation({
        mutationFn: async (id: number) => {
            return await deleteAuctionItem(id);
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

    // Item form
    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemFormSchema),
        defaultValues: {
            name: "",
            description: "",
            images: [],
            startingBid: 0,
            minimumBidIncrement: 5,
            buyNowPrice: null,
            estimatedValue: null,
            category: "",
            tags: [],
            donorName: "",
            donorPublic: false,
            startTime: null,
            endTime: null,
            status: "draft",
            restrictions: "",
        },
    });

    // Reset form when selected item changes
    useEffect(() => {
        if (selectedItem) {
            form.reset({
                name: selectedItem.name,
                description: selectedItem.description || "",
                images: selectedItem.images || [],
                startingBid: selectedItem.startingBid,
                minimumBidIncrement: selectedItem.minimumBidIncrement,
                buyNowPrice: selectedItem.buyNowPrice,
                estimatedValue: selectedItem.estimatedValue,
                category: selectedItem.category,
                tags: selectedItem.tags || [],
                donorName: selectedItem.donorName,
                donorPublic: selectedItem.donorPublic,
                startTime: selectedItem.startTime ? new Date(selectedItem.startTime).toISOString().substring(0, 16) : null,
                endTime: selectedItem.endTime ? new Date(selectedItem.endTime).toISOString().substring(0, 16) : null,
                status: selectedItem.status,
                restrictions: selectedItem.restrictions,
            });
        } else if (newItemMode) {
            form.reset({
                name: "",
                description: "",
                images: [],
                startingBid: 0,
                minimumBidIncrement: 5,
                buyNowPrice: null,
                estimatedValue: null,
                category: "",
                tags: [],
                donorName: "",
                donorPublic: false,
                startTime: null,
                endTime: null,
                status: "draft",
                restrictions: "",
            });
        }
    }, [selectedItem, newItemMode, form]);

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

    // Handle form submission
    const onSubmit = (data: ItemFormValues) => {
        if (selectedItem) {
            updateItemMutation.mutate({
                ...data,
                id: selectedItem.id,
            });
        } else {
            createItemMutation.mutate(data);
        }
    };

    // Handle item deletion
    const handleDeleteItem = (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            deleteItemMutation.mutate(id);
        }
    };

    // Handle category selection
    const handleCategorySelect = (category: string) => {
        form.setValue("category", category);
        setCategoryDropdownOpen(false);
    };

    // Toggle category dropdown
    const toggleCategoryDropdown = () => {
        setCategoryDropdownOpen(!categoryDropdownOpen);
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
                                <form onSubmit={form.handleSubmit(onSubmit)} className={styles.itemForm}>
                                    <div className={styles.formHeader}>
                                        <h2 className={styles.formTitle}>{selectedItem ? "Edit Item" : "Add New Item"}</h2>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formLeftColumn}>
                                            {/* Basic Item Information */}
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>
                                                    Name<span className={styles.requiredMark}>*</span>
                                                </label>
                                                <input className={styles.formInput} {...form.register("name")} placeholder="Item name" />
                                                {form.formState.errors.name && <p className={styles.formError}>{form.formState.errors.name.message}</p>}
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>
                                                    Starting Bid<span className={styles.requiredMark}>*</span>
                                                </label>
                                                <div className={styles.currencyInput}>
                                                    <span className={styles.currencySymbol}>$</span>
                                                    <input className={styles.formInput} type="number" step="0.01" {...form.register("startingBid")} placeholder="0.00" />
                                                </div>
                                                {form.formState.errors.startingBid && <p className={styles.formError}>{form.formState.errors.startingBid.message}</p>}
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Buy Now Price</label>
                                                <div className={styles.currencyInput}>
                                                    <span className={styles.currencySymbol}>$</span>
                                                    <input className={styles.formInput} type="number" step="0.01" {...form.register("buyNowPrice")} placeholder="0.00" />
                                                </div>
                                                {form.formState.errors.buyNowPrice && <p className={styles.formError}>{form.formState.errors.buyNowPrice.message}</p>}
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>
                                                    Category<span className={styles.requiredMark}>*</span>
                                                </label>
                                                <div className={styles.categorySelect}>
                                                    <div className={styles.selectedCategory} onClick={toggleCategoryDropdown}>
                                                        <span>{form.watch("category") || "Select category"}</span>
                                                        <ChevronDown className={styles.dropdownIcon} />
                                                    </div>
                                                    {categoryDropdownOpen && (
                                                        <div className={styles.categoryDropdown}>
                                                            {categories && categories.length > 0 ? (
                                                                categories.map((category) => (
                                                                    <div key={category} className={styles.categoryOption} onClick={() => handleCategorySelect(category)}>
                                                                        {category}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className={styles.categoryOption}>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter new category"
                                                                        {...form.register("category")}
                                                                        className={styles.newCategoryInput}
                                                                        autoFocus
                                                                        onBlur={() => setCategoryDropdownOpen(false)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                setCategoryDropdownOpen(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                            {categories && categories.length > 0 && (
                                                                <div className={styles.categoryOption}>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Or enter new category"
                                                                        className={styles.newCategoryInput}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                                                form.setValue("category", e.currentTarget.value.trim());
                                                                                setCategoryDropdownOpen(false);
                                                                            }
                                                                        }}
                                                                        onBlur={() => setCategoryDropdownOpen(false)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {form.formState.errors.category && <p className={styles.formError}>{form.formState.errors.category.message}</p>}
                                            </div>
                                        </div>

                                        <div className={styles.formRightColumn}>
                                            {/* Item image preview */}
                                            <div className={styles.imagePreview}>
                                                {(() => {
                                                    const images = form.watch("images");
                                                    if (images && images.length > 0) {
                                                        return <img src={images[0]} alt="Item preview" className={styles.previewImage} />;
                                                    } else {
                                                        return <div className={styles.noPreviewImage}>No image available</div>;
                                                    }
                                                })()}
                                            </div>

                                            {/* Image URL input */}
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Image URL</label>
                                                <input
                                                    className={styles.formInput}
                                                    placeholder="https://example.com/image.jpg"
                                                    onChange={(e) => {
                                                        const url = e.target.value;
                                                        if (url) {
                                                            form.setValue("images", [url]);
                                                        } else {
                                                            form.setValue("images", []);
                                                        }
                                                    }}
                                                    value={form.watch("images")?.[0] || ""}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description field - full width */}
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            Description<span className={styles.requiredMark}>*</span>
                                        </label>
                                        <textarea className={styles.formTextarea} {...form.register("description")} placeholder="Item description" />
                                        {form.formState.errors.description && <p className={styles.formError}>{form.formState.errors.description.message}</p>}
                                    </div>

                                    {/* Form Actions */}
                                    <div className={styles.formActions}>
                                        <button
                                            type="button"
                                            className={styles.cancelButton}
                                            onClick={() => {
                                                if (newItemMode) {
                                                    setNewItemMode(false);
                                                } else {
                                                    setSelectedItem(null);
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className={styles.saveButton} disabled={createItemMutation.isPending || updateItemMutation.isPending}>
                                            {createItemMutation.isPending || updateItemMutation.isPending ? (
                                                <Loader2 className={styles.spinnerIcon} />
                                            ) : (
                                                <>
                                                    <Check className={styles.saveIcon} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
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
                    <div className={styles.placeholderTab}>
                        <h3 className={styles.placeholderTitle}>Bid Management</h3>
                        <p className={styles.placeholderText}>View and manage all bids across auction items.</p>
                    </div>
                ) : activeAdminTab === "users" ? (
                    <div className={styles.placeholderTab}>
                        <h3 className={styles.placeholderTitle}>User Management</h3>
                        <p className={styles.placeholderText}>Manage user accounts and permissions.</p>
                    </div>
                ) : (
                    <div className={styles.placeholderTab}>
                        <h3 className={styles.placeholderTitle}>Reports</h3>
                        <p className={styles.placeholderText}>Generate and view auction reports.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
