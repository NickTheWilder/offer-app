import type { JSX } from "react";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { getItemCategories, createAuctionItem } from "@/services/graphql-api";
import type { AuctionItem } from "@/types/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./admin-dashboard.module.css"; // TODO: this would be better as a separate file
import { useForm } from "@tanstack/react-form";

interface AddNewItemFormProps {
    selectedItem: AuctionItem | null;
    onSuccess: () => void;
}

export function AddNewItemForm({ selectedItem, onSuccess }: AddNewItemFormProps): JSX.Element {
    // TanStack Form
    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            images: [],
            startingBid: 0,
            minimumBidIncrement: 5,
            buyNowPrice: undefined,
            estimatedValue: undefined,
            category: "",
            tags: [],
            donorName: "",
            donorPublic: false,
            startTime: "",
            endTime: "",
            status: "draft" as const,
            restrictions: "",
        } as ItemFormValues,
        onSubmit: async ({ value }) => {
            // This will be handled by the child component's mutations
            console.log("Form submitted:", value);
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/items"] });
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            onSuccess();
            toast({
                title: "Success",
                description: "Item created successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create item",
                variant: "destructive",
            });
        },
    });

    return (
        <div className={styles.itemForm}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
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
                            <form.Field name="name" children={() => <input className={styles.formInput} placeholder="Item name" />} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Starting Bid<span className={styles.requiredMark}>*</span>
                            </label>
                            <div className={styles.currencyInput}>
                                <span className={styles.currencySymbol}>$</span>
                                <form.Field name="startingBid" children={() => <input className={styles.formInput} type="number" step="0.01" name="startingBid" placeholder="0.00" />} />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Buy Now Price</label>
                            <div className={styles.currencyInput}>
                                <span className={styles.currencySymbol}>$</span>
                                <form.Field name="buyNowPrice" children={() => <input className={styles.formInput} type="number" step="0.01" name="buyNowPrice" placeholder="0.00" />} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>
                            {selectedItem ? "Update Item" : "Create Item"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
