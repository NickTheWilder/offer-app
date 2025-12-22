import { type JSX, FormEvent, useState } from "react";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import styles from "./CreateUserModal.module.css";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps): JSX.Element | null {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "bidder" as "admin" | "bidder",
        bidder_number: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        router.post("/admin/users", formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    role: "bidder",
                    bidder_number: "",
                    password: "",
                    password_confirmation: "",
                });
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Create New User</h2>
                    <button className={styles.closeButton} onClick={onClose} type="button">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            {errors.name && <span className={styles.error}>{errors.name}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            {errors.email && <span className={styles.error}>{errors.email}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className={styles.input}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="address" className={styles.label}>
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                className={styles.input}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                            {errors.address && <span className={styles.error}>{errors.address}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="role" className={styles.label}>
                                Role *
                            </label>
                            <select
                                id="role"
                                className={styles.input}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "bidder" })}
                                required
                            >
                                <option value="bidder">Bidder</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <span className={styles.error}>{errors.role}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="bidder_number" className={styles.label}>
                                Bidder Number
                            </label>
                            <input
                                type="text"
                                id="bidder_number"
                                className={styles.input}
                                value={formData.bidder_number}
                                onChange={(e) => setFormData({ ...formData, bidder_number: e.target.value })}
                            />
                            {errors.bidder_number && <span className={styles.error}>{errors.bidder_number}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Password *
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={styles.input}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={8}
                            />
                            {errors.password && <span className={styles.error}>{errors.password}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password_confirmation" className={styles.label}>
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                className={styles.input}
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
