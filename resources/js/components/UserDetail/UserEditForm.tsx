import type { JSX, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import styles from "./UserEditForm.module.css";

interface UserFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    role: "admin" | "bidder";
    bidder_number: string;
}

interface UserEditFormProps {
    formData: UserFormData;
    errors: Record<string, string>;
    isSaving: boolean;
    onSubmit: (e: FormEvent) => void;
    onCancel: () => void;
    onFieldChange: (field: keyof UserFormData, value: string) => void;
    onAssignBidderNumber: () => void;
}

export default function UserEditForm({
    formData,
    errors,
    isSaving,
    onSubmit,
    onCancel,
    onFieldChange,
    onAssignBidderNumber,
}: UserEditFormProps): JSX.Element {
    return (
        <form onSubmit={onSubmit} className={styles.editForm}>
            <div className={styles.formHeader}>
                <h2>Edit User</h2>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">
                        Name <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={styles.formInput}
                        value={formData.name}
                        onChange={(e) => onFieldChange("name", e.target.value)}
                        required
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">
                        Email <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        className={styles.formInput}
                        value={formData.email}
                        onChange={(e) => onFieldChange("email", e.target.value)}
                        required
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        className={styles.formInput}
                        value={formData.phone}
                        onChange={(e) => onFieldChange("phone", e.target.value)}
                    />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        className={styles.formInput}
                        value={formData.address}
                        onChange={(e) => onFieldChange("address", e.target.value)}
                    />
                    {errors.address && <span className={styles.error}>{errors.address}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="role">
                        Role <span className={styles.required}>*</span>
                    </label>
                    <select
                        id="role"
                        className={styles.formInput}
                        value={formData.role}
                        onChange={(e) => onFieldChange("role", e.target.value)}
                        required
                    >
                        <option value="bidder">Bidder</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <span className={styles.error}>{errors.role}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="bidder_number">Bidder Number</label>
                    <div className={styles.bidderNumberWrapper}>
                        <input
                            type="text"
                            id="bidder_number"
                            className={styles.formInput}
                            value={formData.bidder_number}
                            onChange={(e) => onFieldChange("bidder_number", e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.assignBidderNumberButton}
                            onClick={onAssignBidderNumber}
                            disabled={!!formData.bidder_number}
                        >
                            Assign Number
                            <svg className={styles.gavelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                    {errors.bidder_number && <span className={styles.error}>{errors.bidder_number}</span>}
                </div>
            </div>

            <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={isSaving}>
                    Cancel
                </button>
                <button type="submit" className={styles.saveButton} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className={styles.spinner} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className={styles.saveIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}