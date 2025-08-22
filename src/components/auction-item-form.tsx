import type { JSX } from "react";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import styles from "./admin-dashboard.module.css"; // TODO: this would be better as a separate file
import { useForm } from "@tanstack/react-form";
import type { CreateAuctionItemInput, UpdateAuctionItemInput } from "@/lib/graphql-queries";
import { useMutation } from "@apollo/client";
import { AuctionStatus, AuctionType, CREATE_AUCTION_ITEM } from "@/lib/graphql-queries";
import { useEffect } from "react";
import { setCurrentForm, clearCurrentForm } from "./dev-tools";

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
            startingBid: 0,
            minimumBidIncrement: 5,
            buyNowPrice: undefined,
            estimatedValue: undefined,
            category: "",
            donorName: "",
            isDonorPublic: false,
            imageURL: "",
            auctionType: AuctionType.NotSet,
            status: AuctionStatus.NotSet,
            restrictions: "",
        },
        onSubmit: async ({ value }) => {
            try {
                await createAuctionItem({
                    variables: {
                        input: value,
                    },
                });
            } catch (error) {
                // Error handling is done in the mutation's onError callback
                console.error("Form submission error:", error);
            }
        },
    });

    // Register form with dev tools (dev only)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            setCurrentForm(form);
            return () => clearCurrentForm();
        }
    }, [form]);

    // Create item mutation
    const [createAuctionItem] = useMutation(CREATE_AUCTION_ITEM, {
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
            console.error("Auction item creation failed:", error);

            toast({
                title: "Failed to create item",
                description: "Please check your input and try again. If the problem persists, contact support.",
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
                            <form.Field
                                name="name"
                                children={(field) => (
                                    <input
                                        className={styles.formInput}
                                        placeholder="Item name"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Description<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="description"
                                children={(field) => (
                                    <textarea
                                        className={styles.formInput}
                                        placeholder="Item description"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Starting Bid<span className={styles.requiredMark}>*</span>
                            </label>
                            <div className={styles.currencyInput}>
                                <span className={styles.currencySymbol}>$</span>
                                <form.Field
                                    name="startingBid"
                                    children={(field) => (
                                        <input
                                            className={styles.formInput}
                                            type="number"
                                            placeholder="0.00"
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Buy Now Price</label>
                            <div className={styles.currencyInput}>
                                <span className={styles.currencySymbol}>$</span>
                                <form.Field
                                    name="buyNowPrice"
                                    children={(field) => (
                                        <input
                                            className={styles.formInput}
                                            type="number"
                                            placeholder="0.00"
                                            value={field.state.value || ''}
                                            onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Status<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="status"
                                children={(field) => (
                                    <select
                                        className={styles.formInput}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value as AuctionStatus)}
                                    >
                                        <option value={AuctionStatus.Draft}>Draft</option>
                                        <option value={AuctionStatus.Active}>Active</option>
                                        <option value={AuctionStatus.Closed}>Closed</option>
                                        <option value={AuctionStatus.Cancelled}>Cancelled</option>
                                        <option value={AuctionStatus.Paid}>Paid</option>
                                        <option value={AuctionStatus.NotSet}>Not Set</option>
                                    </select>
                                )}
                            />
                        </div>
                    </div>

                </div>
                <div className={styles.formActions}>
                    <button type="submit" className={styles.addButton}>
                        {selectedItem ? "Update Item" : "Create Item"}
                    </button>
                </div>
            </form>
        </div>
    );
}
