import { gql } from "@apollo/client";
import { AuctionItemFragment } from "./graphql-fragments";

export const GET_AUCTION_ITEMS = gql`
    query GetAuctionItems {
        auctionItems {
            ...AuctionItem
        }
    }
    ${AuctionItemFragment}
`;

export const GET_AUCTION_ITEM = gql`
    query GetAuctionItem($id: UUID!) {
        auctionItems(where: { id: { eq: $id } }) {
            ...AuctionItem
        }
        ${AuctionItemFragment}
    }
`;

export const CREATE_AUCTION_ITEM = gql`
    mutation CreateAuctionItem($input: CreateAuctionItemInput!) {
        createAuctionItem(input: $input) {
            ...AuctionItem
        }
    }
    ${AuctionItemFragment}
`;

export const UPDATE_AUCTION_ITEM = gql`
    mutation UpdateAuctionItem($input: UpdateAuctionItemInput!) {
        updateAuctionItem(input: $input) {
            ...AuctionItem
        }
        ${AuctionItemFragment}
    }
`;

// Export generated types for use in other files
export type { GetAuctionItemsQuery, GetAuctionItemQuery, CreateAuctionItemMutation, UpdateAuctionItemMutation, CreateAuctionItemInput, UpdateAuctionItemInput } from "../types/generated/graphql";

// Export enums as values (not types)
export { AuctionStatus, AuctionType } from "../types/generated/graphql";
