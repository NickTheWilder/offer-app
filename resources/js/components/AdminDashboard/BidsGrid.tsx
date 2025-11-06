import { type JSX } from "react";
import { DollarSign } from "lucide-react";
import { DataGrid, type DataGridColumn, type EmptyStateConfig } from "@/components/ui/DataGrid";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Bid } from "@/types";

interface BidsGridProps {
    bids: Bid[];
}

export function BidsGrid({ bids }: BidsGridProps): JSX.Element {
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
        key: "user",
        header: "User",
        accessor: (bid) => bid.user_name,
        render: (value, bid) => (
            <div>
                <div style={{ fontWeight: 500 }}>{value}</div>
                {bid.user_bidder_number && (
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>#{bid.user_bidder_number}</div>
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
        header: "Auction Item",
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
        sortable: true,
        hideOnMobile: true,
    },
];

const bidsEmptyState: EmptyStateConfig = {
    icon: <DollarSign />,
    title: "No Bids Found",
    description: "There are currently no bids in the system.",
};
