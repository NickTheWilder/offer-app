import { type JSX, useState } from "react";
import { Trash2, TrendingUp, Edit } from "lucide-react";
import { router } from "@inertiajs/react";
import { DataGrid, type DataGridColumn, type DataGridAction, type EmptyStateConfig } from "@/components/ui/DataGrid";
import { formatCurrency, formatDate } from "@/lib/utils";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import EditBidModal from "./EditBidModal";
import type { Bid, User, AuctionItem } from "@/types";
import styles from "./UserGrid.module.css";

interface BidsGridProps {
    bids: Bid[];
    users?: User[];
    items?: AuctionItem[];
}

export function BidsGrid({ bids, users = [], items = [] }: BidsGridProps): JSX.Element {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bidToDelete, setBidToDelete] = useState<Bid | null>(null);
    const [bidToEdit, setBidToEdit] = useState<Bid | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEditClick = (bid: Bid) => {
        setBidToEdit(bid);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (bid: Bid) => {
        setBidToDelete(bid);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (!bidToDelete) return;

        setIsDeleting(true);

        router.delete(`/admin/bids/${bidToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setBidToDelete(null);
            },
            onError: () => {
                console.error("Failed to delete bid");
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const bidActions: DataGridAction<Bid>[] = [
        {
            type: "edit",
            icon: <Edit className={styles.actionIcon} />,
            title: "Edit bid",
            handler: handleEditClick,
        },
        {
            type: "delete",
            icon: <Trash2 className={styles.actionIcon} />,
            title: "Delete bid",
            handler: handleDeleteClick,
        },
    ];

    return (
        <>
            <div className={styles.userGridContainer}>
                <DataGrid
                    data={bids}
                    columns={bidColumns}
                    actions={bidActions}
                    emptyStateConfig={bidsEmptyState}
                    searchConfig={{
                        placeholder: "Search bids...",
                    }}
                />
            </div>

            <EditBidModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                bid={bidToEdit}
                users={users}
                items={items}
            />

            {bidToDelete && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Bid"
                    message={`Are you sure you want to delete this bid for ${formatCurrency(bidToDelete.amount)}? This action cannot be undone.`}
                    isLoading={isDeleting}
                />
            )}
        </>
    );
}

const bidColumns: DataGridColumn<Bid>[] = [
    {
        key: "user",
        header: "User",
        accessor: (bid) => bid.user?.name || "Unknown",
        render: (value, bid) => (
            <div>
                <div style={{ fontWeight: 500 }}>{value}</div>
                {bid.user?.bidder_number && (
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>#{bid.user.bidder_number}</div>
                )}
            </div>
        ),
        searchable: true,
        sortable: true,
    },
    {
        key: "amount",
        header: "Amount",
        accessor: (bid) => bid.amount,
        render: (value) => <span style={{ fontWeight: 600 }}>{formatCurrency(value)}</span>,
        sortable: true,
    },
    {
        key: "auction_item",
        header: "Item",
        accessor: (bid) => (bid as Bid & { auction_item_name?: string }).auction_item_name,
        render: (value) => <span>{value || "N/A"}</span>,
        searchable: true,
        sortable: true,
    },
    {
        key: "created_at",
        header: "Date",
        accessor: (bid) => bid.created_at,
        render: (value) => <span>{formatDate(value)}</span>,
        sortable: true,
        hideOnMobile: true,
    },
];

const bidsEmptyState: EmptyStateConfig = {
    icon: <TrendingUp />,
    title: "No Bids Found",
    description: "There are currently no bids in the system.",
};
