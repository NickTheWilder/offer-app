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
    donor_name?: string;
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

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};
