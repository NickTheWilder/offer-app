/* eslint-disable */
import * as types from "./graphql";
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query GetAuctionItems {\n        auctionItems {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n": typeof types.GetAuctionItemsDocument;
    "\n    query GetAuctionItem($id: UUID!) {\n        auctionItems(where: { id: { eq: $id } }) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n": typeof types.GetAuctionItemDocument;
    "\n    mutation CreateAuctionItem($input: CreateAuctionItemInput!) {\n        createAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n": typeof types.CreateAuctionItemDocument;
    "\n    mutation UpdateAuctionItem($input: UpdateAuctionItemInput!) {\n        updateAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n": typeof types.UpdateAuctionItemDocument;
};
const documents: Documents = {
    "\n    query GetAuctionItems {\n        auctionItems {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n":
        types.GetAuctionItemsDocument,
    "\n    query GetAuctionItem($id: UUID!) {\n        auctionItems(where: { id: { eq: $id } }) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n":
        types.GetAuctionItemDocument,
    "\n    mutation CreateAuctionItem($input: CreateAuctionItemInput!) {\n        createAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n":
        types.CreateAuctionItemDocument,
    "\n    mutation UpdateAuctionItem($input: UpdateAuctionItemInput!) {\n        updateAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n":
        types.UpdateAuctionItemDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    query GetAuctionItems {\n        auctionItems {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"
): (typeof documents)["\n    query GetAuctionItems {\n        auctionItems {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    query GetAuctionItem($id: UUID!) {\n        auctionItems(where: { id: { eq: $id } }) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"
): (typeof documents)["\n    query GetAuctionItem($id: UUID!) {\n        auctionItems(where: { id: { eq: $id } }) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    mutation CreateAuctionItem($input: CreateAuctionItemInput!) {\n        createAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"
): (typeof documents)["\n    mutation CreateAuctionItem($input: CreateAuctionItemInput!) {\n        createAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    mutation UpdateAuctionItem($input: UpdateAuctionItemInput!) {\n        updateAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"
): (typeof documents)["\n    mutation UpdateAuctionItem($input: UpdateAuctionItemInput!) {\n        updateAuctionItem(input: $input) {\n            id\n            name\n            description\n            imageURL\n            startingBid\n            minimumBidIncrement\n            buyNowPrice\n            estimatedValue\n            category\n            auctionType\n            donorName\n            isDonorPublic\n            status\n            restrictions\n        }\n    }\n"];

export function gql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
