import { type JSX } from "react";
import { DollarSign } from "lucide-react";
import { DataGrid, type DataGridColumn, type EmptyStateConfig } from "@/components/ui/DataGrid";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Bid } from "@/types";

interface UserBidsGridProps {
    bids: Bid[];
}

export default function UserBidsGrid({ bids }: UserBidsGridProps): JSX.Element {
    return (
        <DataGrid
            data={bids}
            columns={bidColumns}
            emptyStateConfig={bidsEmptyState}
            searchConfig={{
                placeholder: "Search bids...",
            }}
        />
    );
}

const bidColumns: DataGridColumn<Bid>[] = [
    {
        key: "amount",
        header: "Amount",
        accessor: (bid) => bid.amount,
        render: (value) => <span style={{ fontWeight: 600 }}>{formatCurrency(value)}</span>,
        searchable: true,
        sortable: true,
    },
    {
        key: "auction_item_id",
        header: "Item ID",
        accessor: (bid) => bid.auction_item_id,
        render: (value) => <span># {value}</span>,
        searchable: true,
    },
    {
        key: "auction_item",
        header: "Item Name",
        accessor: (bid) => bid.auction_item_name,
        render: (value) => <span>{value}</span>,
        searchable: true,
        sortable: true,
    },
    {
        key: "created_at",
        header: "Timestamp",
        accessor: (bid) => bid.created_at,
        render: (value) => <span>{formatDate(value)}</span>,
        searchable: true,
        sortable: true,
    },
];

const bidsEmptyState: EmptyStateConfig = {
    icon: <DollarSign />,
    title: "No Bids Found",
    description: "This user has not placed any bids yet.",
};
