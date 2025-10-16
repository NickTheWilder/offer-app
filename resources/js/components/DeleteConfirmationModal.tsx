import React, { type JSX } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import styles from "./DeleteConfirmationModal.module.css";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, itemName, isLoading = false }: DeleteConfirmationModalProps): JSX.Element | null {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.warningIconContainer}>
                        <AlertTriangle className={styles.warningIcon} />
                    </div>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <p className={styles.modalDescription}>{message}</p>
                    {itemName && (
                        <div className={styles.itemNameContainer}>
                            <span className={styles.itemName}>&ldquo;{itemName}&rdquo;</span>
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button className={styles.deleteButton} onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className={styles.spinner} />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className={styles.deleteIcon} />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
