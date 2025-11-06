import { type JSX, FormEvent, useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import type { User, AuctionItem, Bid } from "@/types";
import styles from "./CreateUserModal.module.css";

interface EditBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    bid: Bid | null;
    users: User[];
    items: AuctionItem[];
}

export default function EditBidModal({ isOpen, onClose, bid, users, items }: EditBidModalProps): JSX.Element | null {
    const [formData, setFormData] = useState({
        user_id: "",
        auction_item_id: "",
        amount: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form data when bid changes
    useEffect(() => {
        if (bid) {
            setFormData({
                user_id: bid.user_id.toString(),
                auction_item_id: bid.auction_item_id.toString(),
                amount: bid.amount.toString(),
            });
        }
    }, [bid]);

    if (!isOpen || !bid) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        router.put(`/admin/bids/${bid.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
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
                    <h2 className={styles.modalTitle}>Edit Bid</h2>
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
                            <label htmlFor="auction_item_id" className={styles.label}>
                                Auction Item *
                            </label>
                            <select
                                id="auction_item_id"
                                className={styles.input}
                                value={formData.auction_item_id}
                                onChange={(e) => setFormData({ ...formData, auction_item_id: e.target.value })}
                                required
                            >
                                <option value="">Select item...</option>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.auction_item_id && <span className={styles.error}>{errors.auction_item_id}</span>}
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
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
