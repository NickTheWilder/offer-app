import { type JSX, useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import styles from "./UserGrid.module.css";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";

export function UserGrid({ users = [] }: { users: User[] }): JSX.Element {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) {
            return users;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        return users.filter((user) => {
            return (
                user.name.toLowerCase().includes(lowerSearchTerm) ||
                user.email.toLowerCase().includes(lowerSearchTerm) ||
                user.phone?.toLowerCase().includes(lowerSearchTerm) ||
                user.address?.toLowerCase().includes(lowerSearchTerm) ||
                user.role.toLowerCase().includes(lowerSearchTerm) ||
                user.bidder_number?.toLowerCase().includes(lowerSearchTerm)
            );
        });
    }, [users, searchTerm]);

    if (users.length === 0) {
        return (
            <div className={styles.userDashboard}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconContainer}>
                        <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className={styles.emptyTitle}>No Users Found</h3>
                    <p className={styles.emptyText}>There are currently no users in the system.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.userDashboard}>
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    {searchTerm && (
                        <button className={styles.clearButton} onClick={() => setSearchTerm("")} title="Clear search">
                            <svg className={styles.clearIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className={styles.searchResults}>
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                )}
            </div>

            {filteredUsers.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconContainer}>
                        <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className={styles.emptyTitle}>No Users Found</h3>
                    <p className={styles.emptyText}>No users match your search criteria. Try a different search term.</p>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Bidder Number</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} onDoubleClick={() => router.visit(`/admin/users/${user.id}`)}>
                                        <td>
                                            <span className={styles.userName}>{user.name}</span>
                                        </td>
                                        <td>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </td>
                                        <td>{user.phone || <span className={styles.emptyCell}>—</span>}</td>
                                        <td>{user.address || <span className={styles.emptyCell}>—</span>}</td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${styles[user.role]}`}>{user.role}</span>
                                        </td>
                                        <td>{user.bidder_number || <span className={styles.emptyCell}>—</span>}</td>
                                        <td>
                                            <span className={styles.dateCell}>{formatDate(user.created_at)}</span>
                                        </td>
                                        <td>
                                            <div className={styles.actionsCell}>
                                                <button className={`${styles.actionButton} ${styles.view}`} title="View details" onClick={() => router.visit(`/admin/users/${user.id}`)}>
                                                    <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button className={`${styles.actionButton} ${styles.edit}`} title="Edit user" onClick={() => router.visit(`/admin/users/${user.id}?edit=true`)}>
                                                    <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
