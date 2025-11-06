import { type JSX } from "react";
import { ShoppingCart } from "lucide-react";
import { DataGrid, type DataGridColumn, type EmptyStateConfig } from "@/components/ui/DataGrid";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Sale } from "@/types";

interface UserSalesGridProps {
    sales: Sale[];
}

export default function UserSalesGrid({ sales }: UserSalesGridProps): JSX.Element {
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
        render: (value) => <span>{value}</span>,
        searchable: true,
        sortable: true,
    },
    {
        key: "sale_date",
        header: "Timestamp",
        accessor: (sale) => sale.sale_date,
        render: (value) => <span>{formatDate(value)}</span>,
        sortable: true,
    },
];

const salesEmptyState: EmptyStateConfig = {
    icon: <ShoppingCart />,
    title: "No Sales Found",
    description: "This user has not made any purchases yet.",
};
