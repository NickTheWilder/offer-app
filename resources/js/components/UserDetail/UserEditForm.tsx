import type { JSX, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { FormInput } from "../fields/FormInput";
import { FormSelect } from "../fields/FormSelect";
import sharedStyles from "../fields/Fields.module.css";
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

            <div className={sharedStyles.formGrid}>
                <div className={sharedStyles.formLeftColumn}>
                    <FormInput
                        label="Name"
                        value={formData.name}
                        onChange={(value) => onFieldChange("name", value)}
                        errors={errors.name ? [errors.name] : []}
                        required
                    />

                    <FormInput
                        label="Email"
                        value={formData.email}
                        onChange={(value) => onFieldChange("email", value)}
                        errors={errors.email ? [errors.email] : []}
                        required
                    />

                    <FormInput
                        label="Phone"
                        value={formData.phone}
                        onChange={(value) => onFieldChange("phone", value)}
                        errors={errors.phone ? [errors.phone] : []}
                    />
                </div>

                <div className={sharedStyles.formRightColumn}>
                    <FormInput
                        label="Address"
                        value={formData.address}
                        onChange={(value) => onFieldChange("address", value)}
                        errors={errors.address ? [errors.address] : []}
                    />

                    <FormSelect<string>
                        label="Role"
                        value={formData.role}
                        onChange={(value) => onFieldChange("role", value)}
                        errors={errors.role ? [errors.role] : []}
                        required
                    >
                        <option value="bidder">Bidder</option>
                        <option value="admin">Admin</option>
                    </FormSelect>

                    <div className={sharedStyles.formGroup}>
                        <label className={sharedStyles.formLabel} htmlFor="bidder_number">Bidder Number</label>
                        <div className={styles.bidderNumberWrapper}>
                            <input
                                type="text"
                                id="bidder_number"
                                className={sharedStyles.formInput}
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
                        {errors.bidder_number && <span className={sharedStyles.formError}>{errors.bidder_number}</span>}
                    </div>
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