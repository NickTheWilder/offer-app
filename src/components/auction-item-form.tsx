import type { JSX } from "react";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import styles from "./admin-dashboard.module.css"; // TODO: this would be better as a separate file
import { useForm } from "@tanstack/react-form";
import type { CreateAuctionItemInput, UpdateAuctionItemInput } from "@/lib/graphql-queries";
import { useMutation } from "@apollo/client";
import { CREATE_AUCTION_ITEM } from "@/lib/graphql-queries";

interface AuctionItemFormProps {
    selectedItem: UpdateAuctionItemInput | null;
    onSuccess: () => void;
}

export function AuctionItemForm({ selectedItem, onSuccess }: AuctionItemFormProps): JSX.Element {
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
        },
        onSubmit: async ({ value }) => {
            try {
                await createAuctionItem({
                    variables: {
                        input: value as CreateAuctionItemInput,
                    },
                });
            } catch (error) {
                // Error handling is done in the mutation's onError callback
                console.error("Form submission error:", error);
            }
        },
    });

    // Create item mutation
    const [createAuctionItem, { loading, error }] = useMutation(CREATE_AUCTION_ITEM, {
        onCompleted: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/items"] });
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            onSuccess();
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
