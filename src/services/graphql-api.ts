import { apolloClient } from '../lib/apollo-client';
import {
  GET_AUCTION_ITEMS,
  GET_AUCTION_ITEM,
  CREATE_AUCTION_ITEM,
  UPDATE_AUCTION_ITEM,
  type GetAuctionItemsQuery,
  type CreateAuctionItemInput,
  type UpdateAuctionItemInput,
  AuctionStatus,
  AuctionType
} from '../lib/graphql-queries';
import type { AuctionItem, InsertAuctionItem } from '../types/schema';
import { ApolloError } from '@apollo/client';

// Helper function to extract validation errors from GraphQL errors
function extractValidationErrors(error: ApolloError): string {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const gqlError = error.graphQLErrors[0];

    // Check if it's a validation error by looking at the extensions.message
    if (gqlError.extensions?.message &&
        typeof gqlError.extensions.message === 'string' &&
        gqlError.extensions.message.includes('Validation failed')) {

      // Return the validation message from extensions
      return gqlError.extensions.message;
    }

    // Fallback to the main error message
    return gqlError.message || 'An error occurred';
  }

  // Default error message
  return error.message || 'An error occurred';
}

// Helper function to map GraphQL AuctionStatus to frontend status
function mapAuctionStatus(status: AuctionStatus): AuctionItem['status'] {
  switch (status) {
    case AuctionStatus.Draft:
      return 'draft';
    case AuctionStatus.Active:
      return 'active';
    case AuctionStatus.Closed:
      return 'sold';
    case AuctionStatus.Paid:
      return 'sold';
    case AuctionStatus.Cancelled:
      return 'unsold';
    default:
      return 'draft';
  }
}

// Helper function to map frontend status to GraphQL AuctionStatus
function mapToAuctionStatus(status: string): AuctionStatus {
  switch (status) {
    case 'draft':
      return AuctionStatus.Draft;
    case 'published':
      return AuctionStatus.Active;
    case 'active':
      return AuctionStatus.Active;
    case 'sold':
      return AuctionStatus.Closed;
    case 'unsold':
      return AuctionStatus.Cancelled;
    default:
      return AuctionStatus.Draft;
  }
}

// Helper function to map frontend auction type to GraphQL AuctionType
function mapToAuctionType(auctionType: string): AuctionType {
  switch (auctionType) {
    case 'silent':
      return AuctionType.Silent;
    case 'live':
      return AuctionType.Live;
    default:
      return AuctionType.Silent;
  }
}

// Helper function to transform GraphQL auction item to frontend type
function transformAuctionItem(gqlItem: GetAuctionItemsQuery['auctionItems'][0]): AuctionItem {
  return {
    id: parseInt(gqlItem.id), // Convert string ID to number for frontend compatibility
    name: gqlItem.name,
    description: gqlItem.description || null,
    images: gqlItem.imageURL ? [gqlItem.imageURL] : null,
    startingBid: gqlItem.startingBid,
    minimumBidIncrement: gqlItem.minimumBidIncrement,
    buyNowPrice: gqlItem.buyNowPrice || null,
    estimatedValue: gqlItem.estimatedValue || null,
    category: gqlItem.category || '',
    tags: null, // Not supported in backend yet
    auctionType: 'silent' as const,
    displayOrder: 0, // Not supported in backend yet
    donorName: gqlItem.donorName || null,
    donorPublic: gqlItem.isDonorPublic,
    startTime: null, // Not supported in backend yet
    endTime: null, // Not supported in backend yet
    status: mapAuctionStatus(gqlItem.status),
    restrictions: gqlItem.restrictions || null,
    additionalDetails: null, // Not supported in backend yet
    createdAt: null, // Not included in GraphQL response
    updatedAt: null, // Not included in GraphQL response
  };
}

// Helper function to transform frontend insert type to GraphQL input
function transformToCreateInput(itemData: InsertAuctionItem): CreateAuctionItemInput {
  return {
    name: itemData.name,
    description: itemData.description || '',
    imageURL: itemData.images?.[0] || '',
    startingBid: itemData.startingBid,
    minimumBidIncrement: itemData.minimumBidIncrement || 5,
    buyNowPrice: itemData.buyNowPrice || undefined,
    estimatedValue: itemData.estimatedValue || undefined,
    category: itemData.category,
    auctionType: mapToAuctionType(itemData.auctionType || 'silent'),
    donorName: itemData.donorName || '',
    isDonorPublic: itemData.donorPublic || false,
    restrictions: itemData.restrictions || undefined,
    status: mapToAuctionStatus(itemData.status || 'draft'),
  };
}

export async function getAuctionItems(filter?: { category?: string; status?: string }): Promise<AuctionItem[]> {
  try {
    const { data } = await apolloClient.query({
      query: GET_AUCTION_ITEMS,
      fetchPolicy: 'cache-first',
    });

    let items = data.auctionItems.map(transformAuctionItem);

    // Apply client-side filtering since GraphQL filtering might not be fully implemented
    if (filter?.category) {
      items = items.filter((item: AuctionItem) => item.category === filter.category);
    }

    if (filter?.status) {
      items = items.filter((item: AuctionItem) => item.status === filter.status);
    }

    return items;
  } catch (error) {
    console.error('Error fetching auction items:', error);
    throw new Error('Failed to fetch auction items');
  }
}

export async function getAuctionItem(id: number): Promise<AuctionItem | null> {
  try {
    const { data } = await apolloClient.query({
      query: GET_AUCTION_ITEM,
      variables: { id: id.toString() },
      fetchPolicy: 'cache-first',
    });

    if (!data.auctionItems || data.auctionItems.length === 0) {
      return null;
    }

    return transformAuctionItem(data.auctionItems[0]);
  } catch (error) {
    console.error('Error fetching auction item:', error);
    return null;
  }
}

export async function createAuctionItem(itemData: InsertAuctionItem): Promise<AuctionItem> {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_AUCTION_ITEM,
      variables: { input: transformToCreateInput(itemData) },
    });

    return transformAuctionItem(data.createAuctionItem);
  } catch (error) {
    console.error('Error creating auction item:', error);

    if (error instanceof ApolloError) {
      const friendlyMessage = extractValidationErrors(error);
      throw new Error(friendlyMessage);
    }

    throw error;
  }
}

export async function updateAuctionItem(id: number, itemData: Partial<AuctionItem>): Promise<AuctionItem> {
  try {
    const updateInput: UpdateAuctionItemInput = {
      id: id.toString(),
      ...(itemData.name && { name: itemData.name }),
      ...(itemData.description !== undefined && { description: itemData.description || undefined }),
      ...(itemData.images && { imageURL: itemData.images[0] }),
      ...(itemData.startingBid !== undefined && { startingBid: itemData.startingBid }),
      ...(itemData.minimumBidIncrement !== undefined && { minimumBidIncrement: itemData.minimumBidIncrement }),
      ...(itemData.buyNowPrice !== undefined && { buyNowPrice: itemData.buyNowPrice || undefined }),
      ...(itemData.estimatedValue !== undefined && { estimatedValue: itemData.estimatedValue || undefined }),
      ...(itemData.category && { category: itemData.category }),
      ...(itemData.auctionType && { auctionType: mapToAuctionType(itemData.auctionType) }),
      ...(itemData.donorName !== undefined && { donorName: itemData.donorName || undefined }),
      ...(itemData.donorPublic !== undefined && { isDonorPublic: itemData.donorPublic }),
      ...(itemData.status && { status: mapToAuctionStatus(itemData.status) }),
      ...(itemData.restrictions !== undefined && { restrictions: itemData.restrictions || undefined }),
    };

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_AUCTION_ITEM,
      variables: { input: updateInput },
    });

    return transformAuctionItem(data.updateAuctionItem);
  } catch (error) {
    console.error('Error updating auction item:', error);

    if (error instanceof ApolloError) {
      const friendlyMessage = extractValidationErrors(error);
      throw new Error(friendlyMessage);
    }

    throw error;
  }
}

export async function deleteAuctionItem(): Promise<boolean> {
  // Note: Delete functionality is not implemented in the backend yet
  // This would need to be added to the GraphQL schema and resolvers
  console.warn('Delete auction item not implemented in backend');
  throw new Error('Delete functionality not yet available');
}

export async function getItemCategories(): Promise<string[]> {
  try {
    // Since there's no dedicated categories endpoint, we'll get all items and extract unique categories
    const items = await getAuctionItems();
    const categories = Array.from(new Set(
      items
        .map((item: AuctionItem) => item.category)
        .filter((category): category is string => category !== null && category !== '')
    ));
    return categories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
