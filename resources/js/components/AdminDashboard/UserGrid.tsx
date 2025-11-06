import { type JSX, useState } from "react";
import { router } from "@inertiajs/react";
import { Eye, Edit, Users, UserPlus } from "lucide-react";
import { DataGrid, type DataGridColumn, type DataGridAction, type EmptyStateConfig } from "@/components/ui/DataGrid";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import CreateUserModal from "./CreateUserModal";
import styles from "./UserGrid.module.css";

export function UserGrid({ users = [] }: { users: User[] }): JSX.Element {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <>
            <div className={styles.userGridContainer}>
                <div className={styles.headerActions}>
                    <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
                        <UserPlus size={16} />
                        Create User
                    </button>
                </div>

                <DataGrid
                    data={users}
                    columns={userColumns}
                    actions={userActions}
                    emptyStateConfig={userEmptyState}
                    searchConfig={{ placeholder: "Search..." }}
                    onRowDoubleClick={(user) => router.visit(`/admin/users/${user.id}`)}
                    className={styles.userDashboard}
                />
            </div>

            <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
    );
}

const userColumns: DataGridColumn<User>[] = [
    {
        key: "name",
        header: "Name",
        accessor: (user) => user.name,
        render: (value) => <span className={styles.userName}>{value}</span>,
        searchable: true,
        sortable: true,
    },
    {
        key: "email",
        header: "Email",
        accessor: (user) => user.email,
        render: (value) => <span className={styles.userEmail}>{value}</span>,
        searchable: true,
        sortable: true,
    },
    {
        key: "phone",
        header: "Phone",
        accessor: (user) => user.phone,
        searchable: true,
        hideOnMobile: true,
    },
    {
        key: "address",
        header: "Address",
        accessor: (user) => user.address,
        searchable: true,
        hideOnMobile: true,
    },
    {
        key: "role",
        header: "Role",
        accessor: (user) => user.role,
        render: (value) => (
            <span className={`${styles.roleBadge} ${styles[value as keyof typeof styles]}`}>{value}</span>
        ),
        searchable: true,
        sortable: true,
    },
    {
        key: "bidder_number",
        header: "Bidder Number",
        accessor: (user) => user.bidder_number,
        searchable: true,
        sortable: true,
        hideOnMobile: true,
    },
    {
        key: "created_at",
        header: "Joined",
        accessor: (user) => user.created_at,
        render: (value) => <span className={styles.dateCell}>{formatDate(value)}</span>,
        sortable: true,
        hideOnMobile: true,
    },
];

const userActions: DataGridAction<User>[] = [
    {
        type: "view",
        icon: <Eye className={styles.actionIcon} />,
        title: "View details",
        handler: (user) => router.visit(`/admin/users/${user.id}`),
    },
    {
        type: "edit",
        icon: <Edit className={styles.actionIcon} />,
        title: "Edit user",
        handler: (user) => router.visit(`/admin/users/${user.id}?edit=true`),
    },
];

const userEmptyState: EmptyStateConfig = {
    icon: <Users />,
    title: "No Users Found",
    description: "There are currently no users in the system.",
};
