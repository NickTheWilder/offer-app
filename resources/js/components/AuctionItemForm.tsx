import React, { type JSX, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import styles from "./AdminDashboard.module.css";
import type { AuctionItem } from "@/types";
import { FormInput } from "./fields/form-input";
import { FormTextarea } from "./fields/form-textarea";
import { FormCurrencyInput } from "./fields/form-currency-input";
import { FormSelect } from "./fields/form-select";
import FormFileUpload from "./fields/form-file-upload";

interface AuctionItemFormProps {
    selectedItem: AuctionItem | null;
    onSuccess: () => void;
}

export function AuctionItemForm({ selectedItem, onSuccess }: AuctionItemFormProps): JSX.Element {
    const form = useForm({
        name: selectedItem?.name || "",
        description: selectedItem?.description || "",
        starting_bid: selectedItem?.starting_bid || 0,
        minimum_bid_increment: selectedItem?.minimum_bid_increment || 5,
        buy_now_price: selectedItem?.buy_now_price,
        estimated_value: selectedItem?.estimated_value,
        category: selectedItem?.category || "",
        donor_name: selectedItem?.donor_name || "",
        is_donor_public: selectedItem?.is_donor_public || false,
        auction_type: selectedItem?.auction_type || "silent",
        status: selectedItem?.status || "active",
        restrictions: selectedItem?.restrictions || "",
        files: null as File[] | null,
    });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const url = selectedItem ? `/auction-items/${selectedItem.id}` : "/auction-items";

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("name", form.data.name);
        formData.append("description", form.data.description);
        formData.append("starting_bid", form.data.starting_bid.toString());
        formData.append("minimum_bid_increment", form.data.minimum_bid_increment.toString());
        formData.append("auction_type", form.data.auction_type);
        formData.append("status", form.data.status);
        formData.append("category", form.data.category);
        formData.append("donor_name", form.data.donor_name);
        formData.append("is_donor_public", form.data.is_donor_public ? "1" : "0");

        if (form.data.buy_now_price) {
            formData.append("buy_now_price", form.data.buy_now_price.toString());
        }
        if (form.data.estimated_value) {
            formData.append("estimated_value", form.data.estimated_value.toString());
        }
        if (form.data.restrictions) {
            formData.append("restrictions", form.data.restrictions);
        }

        // Add files if any
        if (form.data.files && form.data.files.length > 0) {
            form.data.files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });
        }

        if (selectedItem) {
            formData.append("_method", "PUT");
        }

        // Inertia doesn't directly support FormData, so we use fetch with CSRF
        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    onSuccess();
                } else {
                    response.json().then((data) => {
                        // Handle validation errors
                        if (data.errors) {
                            Object.keys(data.errors).forEach((key) => {
                                form.setError(key as keyof typeof form.data, data.errors[key][0]);
                            });
                        }
                    });
                }
            })
            .catch((error) => {
                console.error("Failed to submit form", error);
            });
    };

    return (
        <div className={styles.itemForm}>
            <form onSubmit={onSubmit}>
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
                            <FormInput value={form.data.name} onChange={(value) => form.setData("name", value)} placeholder="Item name" errors={form.errors.name ? [form.errors.name] : []} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Description<span className={styles.requiredMark}>*</span>
                            </label>
                            <FormTextarea value={form.data.description} onChange={(value) => form.setData("description", value)} placeholder="Item description" errors={form.errors.description ? [form.errors.description] : []} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Starting Bid<span className={styles.requiredMark}>*</span>
                            </label>
                            <FormCurrencyInput value={form.data.starting_bid} onChange={(value) => form.setData("starting_bid", value)} placeholder="0.00" errors={form.errors.starting_bid ? [form.errors.starting_bid] : []} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Minimum Bid Increment<span className={styles.requiredMark}>*</span>
                            </label>
                            <FormCurrencyInput
                                value={form.data.minimum_bid_increment}
                                onChange={(value) => form.setData("minimum_bid_increment", value)}
                                placeholder="5.00"
                                errors={form.errors.minimum_bid_increment ? [form.errors.minimum_bid_increment] : []}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Buy Now Price</label>
                            <FormCurrencyInput value={form.data.buy_now_price} onChange={(value) => form.setData("buy_now_price", value)} placeholder="0.00" errors={form.errors.buy_now_price ? [form.errors.buy_now_price] : []} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Status<span className={styles.requiredMark}>*</span>
                            </label>
                            <FormSelect value={form.data.status} onChange={(value) => form.setData("status", value as "draft" | "active" | "sold" | "unsold")} errors={form.errors.status ? [form.errors.status] : []}>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="sold">Sold</option>
                                <option value="unsold">Unsold</option>
                            </FormSelect>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Estimated Value</label>
                            <FormCurrencyInput value={form.data.estimated_value} onChange={(value) => form.setData("estimated_value", value)} placeholder="0.00" errors={form.errors.estimated_value ? [form.errors.estimated_value] : []} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Restrictions</label>
                            <textarea className={styles.formInput} placeholder="Any restrictions or special instructions" value={form.data.restrictions} onChange={(e) => form.setData("restrictions", e.target.value)} />
                            {form.errors.restrictions && <div className={styles.formError}>{form.errors.restrictions}</div>}
                        </div>
                    </div>

                    <div className={styles.formRightColumn}>
                        <div className={styles.formGroup}>
                            <FormFileUpload
                                label="Item Images"
                                value={form.data.files}
                                existingFiles={
                                    selectedItem?.files?.map((f) => ({
                                        id: f.id.toString(),
                                        fileName: f.file_name,
                                        originalFileName: f.original_file_name,
                                        contentType: f.content_type,
                                        fileSize: f.file_size,
                                        uploadedAt: f.created_at,
                                        isPrimary: f.is_primary,
                                        dataUrl: f.url,
                                    })) || null
                                }
                                onChange={(files) => form.setData("files", files)}
                                error={form.errors.files as string}
                                multiple={true}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Donor Name<span className={styles.requiredMark}>*</span>
                            </label>
                            <FormInput value={form.data.donor_name} onChange={(value) => form.setData("donor_name", value)} placeholder="John Smith" errors={form.errors.donor_name ? [form.errors.donor_name] : []} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Category<span className={styles.requiredMark}>*</span>
                            </label>
                            <FormInput value={form.data.category} onChange={(value) => form.setData("category", value)} placeholder="Electronics, Art, Gift Cards, etc." errors={form.errors.category ? [form.errors.category] : []} />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Donor Public?</label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" checked={form.data.is_donor_public} onChange={(e) => form.setData("is_donor_public", e.target.checked)} />
                                Show donor name publicly
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                Auction Type<span className={styles.requiredMark}>*</span>
                            </label>
                            <select className={styles.formInput} value={form.data.auction_type} onChange={(e) => form.setData("auction_type", e.target.value as "silent" | "live")}>
                                <option value="silent">Silent</option>
                                <option value="live">Live</option>
                            </select>
                            {form.errors.auction_type && <div className={styles.formError}>{form.errors.auction_type}</div>}
                        </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.addButton} disabled={form.processing}>
                        {form.processing ? "Saving..." : selectedItem ? "Update Item" : "Create Item"}
                    </button>
                </div>
            </form>
        </div>
    );
}
