import { type JSX } from "react";
import { ShoppingCart } from "lucide-react";
import { DataGrid, type DataGridColumn, type EmptyStateConfig } from "@/components/ui/DataGrid";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Sale } from "@/types";

interface SalesGridProps {
    sales: Sale[];
}

export function SalesGrid({ sales }: SalesGridProps): JSX.Element {
    return (
        <DataGrid
            data={sales}
            columns={saleColumns}
            emptyStateConfig={salesEmptyState}
            searchConfig={{
                placeholder: "Search sales...",
            }}
        />
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
        header: "Timestamp",
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
