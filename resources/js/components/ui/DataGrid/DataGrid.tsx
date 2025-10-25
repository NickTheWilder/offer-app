import { type JSX, useState, useMemo } from "react";
import styles from "./DataGrid.module.css";
import { type DataGridProps, type DataItem, type SortState } from "./types";

const defaultEmptyState = {
    icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    title: "No Data Found",
    description: "There are currently no items to display.",
};

export function DataGrid<T extends DataItem>({
    data = [],
    columns,
    searchConfig = {},
    actions = [],
    emptyStateConfig = defaultEmptyState,
    loading = false,
    error,
    className = "",
    onRowClick,
    onRowDoubleClick,
    getRowClassName,
}: DataGridProps<T>): JSX.Element {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortState, setSortState] = useState<SortState>({ column: null, direction: 'asc' });

    const { placeholder = "Search...", customSearchFn } = searchConfig;

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) {
            return data;
        }

        // Use custom search function if provided
        if (customSearchFn) {
            return customSearchFn(data, searchTerm);
        }

        // Default search across searchable columns
        const lowerSearchTerm = searchTerm.toLowerCase();
        return data.filter((item) => {
            return columns.some((column) => {
                if (!column.searchable) return false;

                // Use custom search function for this column if provided
                if (column.searchFn) {
                    return column.searchFn(item, searchTerm);
                }

                // Default search on the accessed value
                const value = column.accessor(item);
                if (value == null) return false;

                return String(value).toLowerCase().includes(lowerSearchTerm);
            });
        });
    }, [data, searchTerm, columns, customSearchFn]);

    // Sort filtered data
    const sortedData = useMemo(() => {
        if (!sortState.column) {
            return filteredData;
        }

        const column = columns.find(col => col.key === sortState.column);
        if (!column || !column.sortable) {
            return filteredData;
        }

        const sorted = [...filteredData].sort((a, b) => {
            // Use custom sort function if provided
            if (column.sortFn) {
                return column.sortFn(a, b);
            }

            // Default sort based on accessor values
            const aValue = column.accessor(a);
            const bValue = column.accessor(b);

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue);
            }

            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        });

        return sortState.direction === 'desc' ? sorted.reverse() : sorted;
    }, [filteredData, sortState, columns]);

    const handleSort = (columnKey: string) => {
        const column = columns.find(col => col.key === columnKey);
        if (!column?.sortable) return;

        setSortState(prevState => {
            if (prevState.column === columnKey) {
                return {
                    column: columnKey,
                    direction: prevState.direction === 'asc' ? 'desc' : 'asc'
                };
            }
            return { column: columnKey, direction: 'asc' };
        });
    };

    const handleRowClick = (item: T) => {
        onRowClick?.(item);
    };

    const handleRowDoubleClick = (item: T) => {
        onRowDoubleClick?.(item);
    };

    const getRowClass = (item: T) => {
        const baseClass = styles.tableRow;
        const customClass = getRowClassName?.(item) || "";
        return `${baseClass} ${customClass}`.trim();
    };

    // Loading state
    if (loading) {
        return (
            <div className={`${styles.dataGrid} ${className}`}>
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner} />
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`${styles.dataGrid} ${className}`}>
                <div className={styles.errorState}>
                    <div className={styles.errorIcon}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>Error Loading Data</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Empty state (no data at all)
    if (data.length === 0) {
        return (
            <div className={`${styles.dataGrid} ${className}`}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconContainer}>
                        {emptyStateConfig.icon}
                    </div>
                    <h3 className={styles.emptyTitle}>{emptyStateConfig.title}</h3>
                    <p className={styles.emptyText}>{emptyStateConfig.description}</p>
                    {emptyStateConfig.action && (
                        <button 
                            className={styles.emptyAction}
                            onClick={emptyStateConfig.action.handler}
                        >
                            {emptyStateConfig.action.label}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.dataGrid} ${className}`}>
            {/* Search Container */}
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder={placeholder}
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            className={styles.clearButton}
                            onClick={() => setSearchTerm("")}
                            title="Clear search"
                        >
                            <svg className={styles.clearIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className={styles.searchResults}>
                        Showing {sortedData.length} of {data.length} items
                    </div>
                )}
            </div>

            {/* No search results state */}
            {sortedData.length === 0 && searchTerm ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIconContainer}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className={styles.emptyTitle}>No Results Found</h3>
                    <p className={styles.emptyText}>
                        No items match your search criteria. Try a different search term.
                    </p>
                </div>
            ) : (
                /* Table Container */
                <div className={styles.tableContainer}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className={`${column.className || ''} ${column.hideOnMobile ? styles.hideOnMobile : ''} ${column.sortable ? styles.sortable : ''}`}
                                            onClick={() => column.sortable && handleSort(column.key)}
                                        >
                                            <div className={styles.headerContent}>
                                                <span>{column.header}</span>
                                                {column.sortable && (
                                                    <div className={styles.sortIndicator}>
                                                        {sortState.column === column.key && (
                                                            <svg 
                                                                className={`${styles.sortIcon} ${sortState.direction === 'desc' ? styles.sortDesc : ''}`}
                                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                                      d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    {actions.length > 0 && (
                                        <th className={styles.actionsHeader}>Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={getRowClass(item)}
                                        onClick={() => handleRowClick(item)}
                                        onDoubleClick={() => handleRowDoubleClick(item)}
                                    >
                                        {columns.map((column) => {
                                            const value = column.accessor(item);
                                            let cellContent = column.render ? column.render(value, item) : value;
                                            
                                            // Show empty cell fallback for null/undefined/empty values
                                            if (cellContent == null || cellContent === '') {
                                                cellContent = <span className={styles.emptyCell}>—</span>;
                                            }
                                            
                                            return (
                                                <td
                                                    key={column.key}
                                                    className={`${column.className || ''} ${column.hideOnMobile ? styles.hideOnMobile : ''}`}
                                                >
                                                    {cellContent}
                                                </td>
                                            );
                                        })}
                                        {actions.length > 0 && (
                                            <td className={styles.actionsCell}>
                                                <div className={styles.actionButtons}>
                                                    {actions
                                                        .filter(action => !action.condition || action.condition(item))
                                                        .map((action, index) => (
                                                            <button
                                                                key={index}
                                                                className={`${styles.actionButton} ${styles[action.type]} ${action.className || ''}`}
                                                                title={action.title}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    action.handler(item);
                                                                }}
                                                            >
                                                                {action.icon}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            </td>
                                        )}
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