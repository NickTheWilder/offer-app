import { gql } from "@apollo/client";

export const AuctionItemFragment = gql`
    fragment AuctionItem on AuctionItem {
        id
        name
        description
        imageURL
        startingBid
        minimumBidIncrement
        buyNowPrice
        estimatedValue
        category
        auctionType
        donorName
        isDonorPublic
        status
        restrictions
    }
`;
