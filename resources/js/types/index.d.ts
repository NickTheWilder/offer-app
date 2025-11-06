export interface User {
    id: number;
    address: string;
    bidder_number?: string;
    created_at: string;
    name: string;
    phone: string;
    role: "admin" | "bidder";
    email: string;
    updated_at: string;
}

export interface AuctionItemFile {
    id: number;
    auction_item_id: number;
    file_name: string;
    original_file_name: string;
    content_type: string;
    file_size: number;
    is_primary: boolean;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface Bid {
    id: number;
    auction_item_id: number;
    user_id: number;
    amount: number;
    created_at: string;
    user?: User;
    auction_item?: AuctionItem;
    auction_item_name?: string;
}

export interface AuctionItem {
    id: number;
    name: string;
    description: string;
    starting_bid: number;
    minimum_bid_increment: number;
    current_bid?: number;
    buy_now_price?: number;
    estimated_value?: number;
    status: "active" | "sold" | "unsold" | "draft";
    category?: string;
    donor_id?: number;
    donor_name?: string;
    donor?: User;
    is_donor_public?: boolean;
    item_number?: string;
    auction_type: "silent" | "live";
    restrictions?: string;
    display_order?: number;
    created_at: string;
    updated_at: string;
    files?: AuctionItemFile[];
    bids?: Bid[];
    high_bidder?: User;
}

export interface Sale {
    id: number;
    transaction_id: string;
    user_id: number;
    auction_item_id: number | null;
    amount: number;
    sale_source: "pre_sale" | "auction" | "raffle" | "day_of" | "other" | "underwriting";
    quantity: number;
    notes: string | null;
    sale_date: string;
    created_at: string;
    updated_at: string;
    user?: User;
    auction_item?: AuctionItem;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    settings: {
        event_name: string;
        event_location: string | null;
        primary_color: string;
        auction_start: string | null;
        auction_end: string | null;
    };
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};
