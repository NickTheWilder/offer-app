import { type JSX, FormEvent, useState } from "react";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import type { User, AuctionItem } from "@/types";
import styles from "./CreateUserModal.module.css";

interface CreateSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    items: AuctionItem[];
}

export default function CreateSaleModal({ isOpen, onClose, users, items }: CreateSaleModalProps): JSX.Element | null {
    const [formData, setFormData] = useState({
        transaction_id: "",
        user_id: "",
        auction_item_id: "",
        amount: "",
        sale_source: "auction",
        quantity: "1",
        notes: "",
        sale_date: new Date().toISOString().split("T")[0],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        router.post("/admin/sales", formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
                setFormData({
                    transaction_id: "",
                    user_id: "",
                    auction_item_id: "",
                    amount: "",
                    sale_source: "auction",
                    quantity: "1",
                    notes: "",
                    sale_date: new Date().toISOString().split("T")[0],
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
                    <h2 className={styles.modalTitle}>Create New Sale</h2>
                    <button className={styles.closeButton} onClick={onClose} type="button">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="user_id" className={styles.label}>
                                User *
                            </label>
                            <select
                                id="user_id"
                                className={styles.input}
                                value={formData.user_id}
                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                required
                            >
                                <option value="">Select user...</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <span className={styles.error}>{errors.user_id}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="amount" className={styles.label}>
                                Amount *
                            </label>
                            <input
                                type="number"
                                id="amount"
                                className={styles.input}
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                step="0.01"
                                min="0"
                            />
                            {errors.amount && <span className={styles.error}>{errors.amount}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="auction_item_id" className={styles.label}>
                                Auction Item
                            </label>
                            <select
                                id="auction_item_id"
                                className={styles.input}
                                value={formData.auction_item_id}
                                onChange={(e) => setFormData({ ...formData, auction_item_id: e.target.value })}
                            >
                                <option value="">None (non-item sale)</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.auction_item_id && <span className={styles.error}>{errors.auction_item_id}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="sale_source" className={styles.label}>
                                Sale Source *
                            </label>
                            <select
                                id="sale_source"
                                className={styles.input}
                                value={formData.sale_source}
                                onChange={(e) => setFormData({ ...formData, sale_source: e.target.value })}
                                required
                            >
                                <option value="auction">Auction</option>
                                <option value="pre_sale">Pre-Sale</option>
                                <option value="raffle">Raffle</option>
                                <option value="day_of">Day Of</option>
                                <option value="underwriting">Underwriting</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.sale_source && <span className={styles.error}>{errors.sale_source}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="sale_date" className={styles.label}>
                                Sale Date *
                            </label>
                            <input
                                type="date"
                                id="sale_date"
                                className={styles.input}
                                value={formData.sale_date}
                                onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                                required
                            />
                            {errors.sale_date && <span className={styles.error}>{errors.sale_date}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="transaction_id" className={styles.label}>
                                Transaction ID
                            </label>
                            <input
                                type="text"
                                id="transaction_id"
                                className={styles.input}
                                value={formData.transaction_id}
                                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                            />
                            {errors.transaction_id && <span className={styles.error}>{errors.transaction_id}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="notes" className={styles.label}>
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                className={styles.input}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                            />
                            {errors.notes && <span className={styles.error}>{errors.notes}</span>}
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Sale"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
