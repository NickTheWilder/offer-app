import type { JSX } from "react";
import { toast } from "@/hooks/use-toast";
import styles from "./admin-dashboard.module.css"; // TODO: this would be better as a separate file
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@apollo/client";
import { AuctionStatus, AuctionType, CREATE_AUCTION_ITEM, GET_AUCTION_ITEMS } from "@/lib/graphql-queries";
import { useEffect } from "react";
import { setCurrentForm, clearCurrentForm } from "./dev-tools";
import type { AuctionItemFragment } from "@/types/generated/graphql";

interface AuctionItemFormProps {
    selectedItem: AuctionItemFragment | null;
    onSuccess: () => void;
}

export function AuctionItemForm({ selectedItem, onSuccess }: AuctionItemFormProps): JSX.Element {

    // TanStack Form
    const form = useForm({
        defaultValues: {
            name: selectedItem?.name || "",
            description: selectedItem?.description || "",
            startingBid: selectedItem?.startingBid || 0,
            minimumBidIncrement: selectedItem?.minimumBidIncrement || 5,
            buyNowPrice: selectedItem?.buyNowPrice || 0,
            estimatedValue: selectedItem?.estimatedValue || 0,
            category: selectedItem?.category || "",
            donorName: selectedItem?.donorName || "",
            isDonorPublic: selectedItem?.isDonorPublic || false,
            imageURL: selectedItem?.imageURL || "",
            auctionType: selectedItem?.auctionType || AuctionType.NotSet,
            status: selectedItem?.status || AuctionStatus.NotSet,
            restrictions: selectedItem?.restrictions || "",
        },
        onSubmit: async ({ value }) => {
            try {
                await createAuctionItem({
                    variables: {
                        input: value,
                    },
                });
            } catch (error: any) {
                // Parse GraphQL validation errors and set them on form fields
                // TODO: Fix me
                if (error.graphQLErrors) {
                    error.graphQLErrors.forEach((gqlError: any) => {
                        if (gqlError.extensions?.validationErrors) {
                            gqlError.extensions.validationErrors.forEach((validationError: any) => {
                                form.setFieldMeta(validationError.field.toLowerCase(), (prev) => ({
                                    ...prev,
                                    errors: [validationError.message],
                                    errorMap: {
                                        onSubmit: validationError.message,
                                    },
                                }));
                            });
                        }
                    });
                }
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
        refetchQueries: [GET_AUCTION_ITEMS],
        awaitRefetchQueries: true,
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
                                            value={field.state.value}
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
                                    </select>
                                )}
                            />
                        </div>
                    </div>

                    <div className={styles.formRightColumn}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Image URL<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="imageURL"
                                children={(field) => (
                                    <input
                                        className={styles.formInput}
                                        placeholder="https://example.com/image.jpg"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Donor Name<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="donorName"
                                children={(field) => (
                                    <input
                                        className={styles.formInput}
                                        placeholder="John Smith"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Category<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="category"
                                children={(field) => (
                                    <input
                                        className={styles.formInput}
                                        placeholder="Electronics, Art, Gift Cards, etc."
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Donor Public?
                            </label>
                            <form.Field
                                name="isDonorPublic"
                                children={(field) => (
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.checked)}
                                        />
                                        Show donor name publicly
                                    </label>
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Auction Type<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="auctionType"
                                children={(field) => (
                                    <select
                                        className={styles.formInput}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value as AuctionType)}
                                    >
                                        <option value={AuctionType.Silent}>Silent</option>
                                        <option value={AuctionType.Live}>Live</option>
                                    </select>
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Estimated Value</label>
                            <div className={styles.currencyInput}>
                                <span className={styles.currencySymbol}>$</span>
                                <form.Field
                                    name="estimatedValue"
                                    children={(field) => (
                                        <input
                                            className={styles.formInput}
                                            type="number"
                                            placeholder="0.00"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Restrictions</label>
                            <form.Field
                                name="restrictions"
                                children={(field) => (
                                    <textarea
                                        className={styles.formInput}
                                        placeholder="Any restrictions or special instructions"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
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
