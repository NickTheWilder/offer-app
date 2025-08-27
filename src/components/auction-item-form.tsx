import type { JSX } from "react";
import styles from "./admin-dashboard.module.css"; // TODO: this would be better as a separate file
import { useForm } from "@tanstack/react-form";
import { AuctionStatus, AuctionType } from "@/lib/graphql-queries";
import { useEffect } from "react";
import { setCurrentForm, clearCurrentForm } from "./dev-tools";
import type { AuctionItemFragment } from "@/types/generated/graphql";
import { FormInput, FormTextarea, FormCurrencyInput, FormSelect, FormFileUpload } from "./fields";
import { useCreateAuctionItem, useUpdateAuctionItem } from "@/hooks/use-auction-item-mutations";

interface AuctionItemFormProps {
    selectedItem: AuctionItemFragment | null;
    onSuccess: () => void;
}

export function AuctionItemForm({ selectedItem, onSuccess }: AuctionItemFormProps): JSX.Element {
    const setFieldError = (fieldName: string, message: string) => {
        form.setFieldMeta(fieldName as keyof typeof form.fieldInfo, (prev) => ({
            ...prev,
            errors: [message],
            errorMap: {
                onSubmit: message,
            },
        }));
    };

    const [createAuctionItem] = useCreateAuctionItem({ onSuccess, setFieldError });
    const [updateAuctionItem] = useUpdateAuctionItem({ onSuccess, setFieldError });

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
            newFiles: null as File[] | null,
            auctionType: selectedItem?.auctionType || AuctionType.NotSet,
            status: selectedItem?.status || AuctionStatus.NotSet,
            restrictions: selectedItem?.restrictions || "",
        },
        onSubmit: async ({ value }) => {
            try {
                // Prepare input - send new files
                const input = {
                    ...value,
                    files: value.newFiles && value.newFiles.length > 0 ? value.newFiles : undefined,
                };
                // Remove the newFiles field as it's not part of the GraphQL schema
                delete (input as any).newFiles;

                if (!selectedItem) {
                    await createAuctionItem({
                        variables: {
                            input,
                        },
                    });
                } else {
                    await updateAuctionItem({
                        variables: {
                            input: {
                                id: selectedItem.id,
                                ...input,
                            },
                        },
                    });
                }
            } catch (error: unknown) {
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
                                    <FormInput
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        placeholder="Item name"
                                        errors={field.state.meta.errors}
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
                                    <FormTextarea
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        placeholder="Item description"
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Starting Bid<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="startingBid"
                                children={(field) => (
                                    <FormCurrencyInput
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        placeholder="0.00"
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Buy Now Price</label>
                            <form.Field
                                name="buyNowPrice"
                                children={(field) => (
                                    <FormCurrencyInput
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        placeholder="0.00"
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Status<span className={styles.requiredMark}>*</span>
                            </label>
                            <form.Field
                                name="status"
                                children={(field) => (
                                    <FormSelect<AuctionStatus>
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        errors={field.state.meta.errors}
                                    >
                                        <option value={AuctionStatus.Draft}>Draft</option>
                                        <option value={AuctionStatus.Active}>Active</option>
                                        <option value={AuctionStatus.Closed}>Closed</option>
                                        <option value={AuctionStatus.Cancelled}>Cancelled</option>
                                        <option value={AuctionStatus.Paid}>Paid</option>
                                    </FormSelect>
                                )}
                            />
                        </div>
                    </div>

                    <div className={styles.formRightColumn}>
                        <div className={styles.formGroup}>
                            <form.Field
                                name="newFiles"
                                children={(field) => (
                                    <FormFileUpload
                                        label="Item Images"
                                        value={field.state.value}
                                        existingFiles={selectedItem?.files || null}
                                        onChange={(files) => {
                                            field.handleChange(files);
                                        }}
                                        error={field.state.meta.errors?.[0]}
                                        multiple={true}
                                        required
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
                                    <FormInput
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        placeholder="John Smith"
                                        errors={field.state.meta.errors}
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
                                    <FormInput
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        placeholder="Electronics, Art, Gift Cards, etc."
                                        errors={field.state.meta.errors}
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
                            <form.Field
                                name="estimatedValue"
                                children={(field) => (
                                    <FormCurrencyInput
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        placeholder="0.00"
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            />
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
