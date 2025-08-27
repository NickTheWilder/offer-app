import { gql } from "@apollo/client";

export const AuctionItemFragment = gql`
    fragment AuctionItem on AuctionItem {
        id
        name
        description
        files {
            id
            fileName
            originalFileName
            contentType
            fileSize
            uploadedAt
            isPrimary
            dataUrl
        }
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
