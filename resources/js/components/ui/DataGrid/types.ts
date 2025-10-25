import { type ReactNode } from "react";

// Base data item - all grid data must have an id
export interface DataItem {
    id: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic data structure for flexible grid usage
    [key: string]: any;
}

// Column configuration for each field
export interface DataGridColumn<T extends DataItem> {
    /** Unique identifier for the column */
    key: string;
    /** Header text displayed in the table */
    header: string;
    /** Function to extract the value from the data item */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Flexible accessor return type for different data structures
    accessor: (item: T) => any;
    /** Custom renderer for the cell content */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Value can be any type returned by accessor function
    render?: (value: any, item: T) => ReactNode;
    /** Whether this column should be included in search (default: false) */
    searchable?: boolean;
    /** Custom search function for this column */
    searchFn?: (item: T, searchTerm: string) => boolean;
    /** Whether this column is sortable (default: false) */
    sortable?: boolean;
    /** Custom sort function */
    sortFn?: (a: T, b: T) => number;
    /** CSS class name for the column */
    className?: string;
    /** Responsive behavior - hide on smaller screens (default: false) */
    hideOnMobile?: boolean;
}

// Action button configuration
export interface DataGridAction<T extends DataItem> {
    /** Action type - used for styling and identification */
    type: 'view' | 'edit' | 'delete' | 'custom';
    /** Icon to display (SVG element or component) */
    icon: ReactNode;
    /** Tooltip text */
    title: string;
    /** Action handler function */
    handler: (item: T) => void;
    /** Conditional visibility */
    condition?: (item: T) => boolean;
    /** Custom CSS class */
    className?: string;
}

// Empty state configuration
export interface EmptyStateConfig {
    /** Icon to display */
    icon: ReactNode;
    /** Main title */
    title: string;
    /** Description text */
    description: string;
    /** Optional action button */
    action?: {
        label: string;
        handler: () => void;
    };
}

// Search configuration
export interface SearchConfig<T extends DataItem> {
    /** Placeholder text for search input (default: "Search...") */
    placeholder?: string;
    /** Custom search function that overrides column-based search */
    customSearchFn?: (items: T[], searchTerm: string) => T[];
    /** Debounce delay in milliseconds (default: 300) */
    debounceMs?: number;
}

// Main DataGrid props
export interface DataGridProps<T extends DataItem> {
    /** Array of data items to display */
    data: T[];
    /** Column configuration */
    columns: DataGridColumn<T>[];
    /** Search configuration (default: enabled with "Search..." placeholder) */
    searchConfig?: SearchConfig<T>;
    /** Action buttons configuration (default: none) */
    actions?: DataGridAction<T>[];
    /** Empty state configuration (default: generic empty state) */
    emptyStateConfig?: EmptyStateConfig;
    /** Loading state (default: false) */
    loading?: boolean;
    /** Error state (default: none) */
    error?: string;
    /** Custom CSS class for the container */
    className?: string;
    /** Row click handler */
    onRowClick?: (item: T) => void;
    /** Double click handler */
    onRowDoubleClick?: (item: T) => void;
    /** Custom row CSS class function */
    getRowClassName?: (item: T) => string;
}

// Sort state
export interface SortState {
    column: string | null;
    direction: 'asc' | 'desc';
}