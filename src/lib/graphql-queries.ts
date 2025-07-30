import { gql } from '@apollo/client';

export const GET_AUCTION_ITEMS = gql`
  query GetAuctionItems {
    auctionItems {
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
  }
`;

export const GET_AUCTION_ITEM = gql`
  query GetAuctionItem($id: UUID!) {
    auctionItems(where: { id: { eq: $id } }) {
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
  }
`;

export const CREATE_AUCTION_ITEM = gql`
  mutation CreateAuctionItem($input: CreateAuctionItemInput!) {
    createAuctionItem(input: $input) {
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
  }
`;

export const UPDATE_AUCTION_ITEM = gql`
  mutation UpdateAuctionItem($input: UpdateAuctionItemInput!) {
    updateAuctionItem(input: $input) {
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
  }
`;

// Export generated types for use in other files
export type {
  GetAuctionItemsQuery,
  GetAuctionItemQuery,
  CreateAuctionItemMutation,
  UpdateAuctionItemMutation,
  CreateAuctionItemInput,
  UpdateAuctionItemInput
} from '../types/generated/graphql';

// Export enums as values (not types)
export {
  AuctionStatus,
  AuctionType
} from '../types/generated/graphql';
