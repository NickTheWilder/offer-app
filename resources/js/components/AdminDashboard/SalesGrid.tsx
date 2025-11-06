import { type JSX, useState } from "react";
import { ShoppingCart, Trash2, PlusCircle, Edit } from "lucide-react";
import { router } from "@inertiajs/react";
import { DataGrid, type DataGridColumn, type DataGridAction, type EmptyStateConfig } from "@/components/ui/DataGrid";
import { formatCurrency, formatDate } from "@/lib/utils";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CreateSaleModal from "./CreateSaleModal";
import EditSaleModal from "./EditSaleModal";
import type { Sale, User, AuctionItem } from "@/types";
import styles from "./UserGrid.module.css";

interface SalesGridProps {
    sales: Sale[];
    users?: User[];
    items?: AuctionItem[];
}

export function SalesGrid({ sales, users = [], items = [] }: SalesGridProps): JSX.Element {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
    const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEditClick = (sale: Sale) => {
        setSaleToEdit(sale);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (sale: Sale) => {
        setSaleToDelete(sale);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (!saleToDelete) return;

        setIsDeleting(true);

        router.delete(`/admin/sales/${saleToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSaleToDelete(null);
            },
            onError: () => {
                console.error("Failed to delete sale");
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const saleActions: DataGridAction<Sale>[] = [
        {
            type: "edit",
            icon: <Edit className={styles.actionIcon} />,
            title: "Edit sale",
            handler: handleEditClick,
        },
        {
            type: "delete",
            icon: <Trash2 className={styles.actionIcon} />,
            title: "Delete sale",
            handler: handleDeleteClick,
        },
    ];

    return (
        <>
            <div className={styles.userGridContainer}>
                <div className={styles.headerActions}>
                    <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
                        <PlusCircle size={16} />
                        Create Sale
                    </button>
                </div>

                <DataGrid
                    data={sales}
                    columns={saleColumns}
                    actions={saleActions}
                    emptyStateConfig={salesEmptyState}
                    searchConfig={{
                        placeholder: "Search sales...",
                    }}
                />
            </div>

            <CreateSaleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                users={users}
                items={items}
            />

            <EditSaleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                sale={saleToEdit}
                users={users}
                items={items}
            />

            {saleToDelete && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Sale"
                    message={`Are you sure you want to delete this sale for $${saleToDelete.amount}? This action cannot be undone.`}
                    isLoading={isDeleting}
                />
            )}
        </>
    );
}

const saleColumns: DataGridColumn<Sale>[] = [
    {
        key: "user",
        header: "User",
        accessor: (sale) => sale.user_name,
        render: (value, sale) => (
            <div>
                <div style={{ fontWeight: 500 }}>{value}</div>
                {sale.user_bidder_number && (
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>#{sale.user_bidder_number}</div>
                )}
            </div>
        ),
        searchable: true,
        sortable: true,
    },
    {
        key: "amount",
        header: "Amount",
        accessor: (sale) => sale.amount,
        render: (value) => <span style={{ fontWeight: 600 }}>{formatCurrency(value)}</span>,
        sortable: true,
    },
    {
        key: "auction_item",
        header: "Item",
        accessor: (sale) => sale.auction_item_name,
        render: (value) => <span>{value || "N/A"}</span>,
        searchable: true,
        sortable: true,
    },
    {
        key: "sale_date",
        header: "Date",
        accessor: (sale) => sale.sale_date,
        render: (value) => <span>{formatDate(value)}</span>,
        sortable: true,
        hideOnMobile: true,
    },
];

const salesEmptyState: EmptyStateConfig = {
    icon: <ShoppingCart />,
    title: "No Sales Found",
    description: "There are currently no sales in the system.",
};
