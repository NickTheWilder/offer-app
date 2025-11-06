import { type JSX, FormEvent, useState } from "react";
import { useForm, router } from "@inertiajs/react";
import sharedStyles from "./fields/Fields.module.css";
import styles from "./AuctionItemForm.module.css";
import type { AuctionItem, User } from "@/types";
import { FormInput } from "./fields/FormInput";
import { FormTextarea } from "./fields/FormTextarea";
import { FormCurrencyInput } from "./fields/FormCurrencyInput";
import { FormSelect } from "./fields/FormSelect";
import { FormCheckbox } from "./fields/FormCheckbox";
import FormFileUpload from "./fields/FormFileUpload";

interface AuctionItemFormProps {
    selectedItem: AuctionItem | null;
    users: User[];
    onSuccess: (updatedItem: AuctionItem) => void;
}

export function AuctionItemForm({ selectedItem, users, onSuccess }: AuctionItemFormProps): JSX.Element {
    const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

    const form = useForm({
        name: selectedItem?.name || "",
        description: selectedItem?.description || "",
        starting_bid: selectedItem?.starting_bid || 0,
        minimum_bid_increment: selectedItem?.minimum_bid_increment || 5,
        buy_now_price: selectedItem?.buy_now_price,
        estimated_value: selectedItem?.estimated_value,
        category: selectedItem?.category || "",
        donor_id: selectedItem?.donor_id || null,
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

        const formData = new FormData();
        formData.append("name", form.data.name);
        formData.append("description", form.data.description);
        formData.append("starting_bid", form.data.starting_bid.toString());
        formData.append("minimum_bid_increment", form.data.minimum_bid_increment.toString());
        formData.append("auction_type", form.data.auction_type);
        formData.append("status", form.data.status);
        formData.append("category", form.data.category);
        if (form.data.donor_id) {
            formData.append("donor_id", form.data.donor_id.toString());
        }
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

        // Add files to remove if any
        if (filesToRemove.length > 0) {
            filesToRemove.forEach((fileId, index) => {
                formData.append(`remove_files[${index}]`, fileId);
            });
        }

        if (selectedItem) {
            formData.append("_method", "PUT");
        }

        router.post(url, formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (page) => {
                // Extract the item from shared props (back()->with() shares it at root level)
                const updatedItem = (page.props as { item?: AuctionItem }).item;

                if (updatedItem) {
                    // Update form data with the returned item
                    form.setData({
                        name: updatedItem.name,
                        description: updatedItem.description,
                        starting_bid: updatedItem.starting_bid,
                        minimum_bid_increment: updatedItem.minimum_bid_increment,
                        buy_now_price: updatedItem.buy_now_price,
                        estimated_value: updatedItem.estimated_value,
                        category: updatedItem.category,
                        donor_id: updatedItem.donor_id,
                        donor_name: updatedItem.donor_name,
                        is_donor_public: updatedItem.is_donor_public,
                        auction_type: updatedItem.auction_type,
                        status: updatedItem.status,
                        restrictions: updatedItem.restrictions,
                        files: null, // Reset files after successful upload
                    });
                    setFilesToRemove([]); // Clear files to remove
                    onSuccess(updatedItem);
                }
            },
            onError: (errors) => {
                console.error("Form submission errors:", errors);

                Object.keys(errors).forEach((key) => {
                    form.setError(key as keyof typeof form.data, errors[key] as string);
                });
            },
        });
    };

    return (
        <div className={styles.itemForm}>
            <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.formContent}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>{selectedItem ? "Edit Item" : "Add New Item"}</h2>
                        <div className={styles.formActions}>
                            <button
                                type="submit"
                                className={styles.addButton}
                                disabled={form.processing}
                            >
                                {form.processing ? "Saving..." : selectedItem ? "Update Item" : "Create Item"}
                            </button>
                        </div>
                    </div>

                    <div className={sharedStyles.formGrid}>
                    <div className={sharedStyles.formLeftColumn}>
                        <FormInput
                            label="Name"
                            value={form.data.name}
                            onChange={(value) => form.setData("name", value)}
                            placeholder="Item name"
                            errors={form.errors.name ? [form.errors.name] : []}
                            required
                        />

                        <FormTextarea
                            label="Description"
                            value={form.data.description}
                            onChange={(value) => form.setData("description", value)}
                            placeholder="Item description"
                            errors={form.errors.description ? [form.errors.description] : []}
                            required
                        />

                        <FormCurrencyInput
                            label="Starting Bid"
                            value={form.data.starting_bid}
                            onChange={(value) => form.setData("starting_bid", value)}
                            placeholder="0.00"
                            errors={form.errors.starting_bid ? [form.errors.starting_bid] : []}
                            required
                        />

                        <FormCurrencyInput
                            label="Minimum Bid Increment"
                            value={form.data.minimum_bid_increment}
                            onChange={(value) => form.setData("minimum_bid_increment", value)}
                            placeholder="5.00"
                            errors={form.errors.minimum_bid_increment ? [form.errors.minimum_bid_increment] : []}
                            required
                        />

                        <FormCurrencyInput
                            label="Buy Now Price"
                            value={form.data.buy_now_price}
                            onChange={(value) => form.setData("buy_now_price", value)}
                            placeholder="0.00"
                            errors={form.errors.buy_now_price ? [form.errors.buy_now_price] : []}
                        />

                        <FormSelect
                            label="Status"
                            value={form.data.status}
                            onChange={(value) =>
                                form.setData("status", value as "draft" | "active" | "sold" | "unsold")
                            }
                            errors={form.errors.status ? [form.errors.status] : []}
                            required
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="sold">Sold</option>
                            <option value="unsold">Unsold</option>
                        </FormSelect>

                        <FormCurrencyInput
                            label="Estimated Value"
                            value={form.data.estimated_value}
                            onChange={(value) => form.setData("estimated_value", value)}
                            placeholder="0.00"
                            errors={form.errors.estimated_value ? [form.errors.estimated_value] : []}
                        />

                        <FormTextarea
                            label="Restrictions"
                            value={form.data.restrictions}
                            onChange={(value) => form.setData("restrictions", value)}
                            placeholder="Any restrictions or special instructions"
                            errors={form.errors.restrictions ? [form.errors.restrictions] : []}
                        />
                    </div>

                    <div className={sharedStyles.formRightColumn}>
                        <div className={sharedStyles.formGroup}>
                            <FormFileUpload
                                label="Item Images"
                                value={form.data.files}
                                existingFiles={
                                    selectedItem?.files
                                        ?.filter((f) => !filesToRemove.includes(f.id.toString()))
                                        .map((f) => ({
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
                                onRemoveExisting={(fileId) => setFilesToRemove([...filesToRemove, fileId])}
                                error={form.errors.files as string}
                                multiple={true}
                                required
                            />
                        </div>

                        <FormSelect
                            label="Donor"
                            value={form.data.donor_id?.toString() || ""}
                            onChange={(value: string) => {
                                const donorId = value ? parseInt(value) : null;
                                const selectedUser = users.find((u) => u.id === donorId);
                                form.setData("donor_id", donorId);
                                form.setData("donor_name", selectedUser?.name || "");
                            }}
                            errors={form.errors.donor_id ? [form.errors.donor_id] : []}
                            required
                        >
                            <option value="">Select a donor...</option>
                            {users.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </FormSelect>

                        <FormInput
                            label="Category"
                            value={form.data.category}
                            onChange={(value) => form.setData("category", value)}
                            placeholder="Electronics, Art, Gift Cards, etc."
                            errors={form.errors.category ? [form.errors.category] : []}
                            required
                        />

                        <FormCheckbox
                            label="Donor Public?"
                            value={form.data.is_donor_public}
                            onChange={(value) => form.setData("is_donor_public", value)}
                            description="Show donor name publicly"
                        />

                        <FormSelect
                            label="Auction Type"
                            value={form.data.auction_type}
                            onChange={(value) => form.setData("auction_type", value as "silent" | "live")}
                            errors={form.errors.auction_type ? [form.errors.auction_type] : []}
                            required
                        >
                            <option value="silent">Silent</option>
                            <option value="live">Live</option>
                        </FormSelect>
                    </div>
                </div>
                </div>
            </form>
        </div>
    );
}
