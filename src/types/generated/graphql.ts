/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Decimal` scalar type represents a decimal floating-point number. */
  Decimal: { input: number; output: number; }
  UUID: { input: string; output: string; }
};

export type AuctionItemFilterInput = {
  and?: InputMaybe<Array<AuctionItemFilterInput>>;
  auctionType?: InputMaybe<AuctionTypeOperationFilterInput>;
  buyNowPrice?: InputMaybe<DecimalOperationFilterInput>;
  category?: InputMaybe<StringOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  displayOrder?: InputMaybe<IntOperationFilterInput>;
  donorName?: InputMaybe<StringOperationFilterInput>;
  estimatedValue?: InputMaybe<DecimalOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  imageURL?: InputMaybe<StringOperationFilterInput>;
  isDonorPublic?: InputMaybe<BooleanOperationFilterInput>;
  minimumBidIncrement?: InputMaybe<DecimalOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AuctionItemFilterInput>>;
  restrictions?: InputMaybe<StringOperationFilterInput>;
  startingBid?: InputMaybe<DecimalOperationFilterInput>;
  status?: InputMaybe<AuctionStatusOperationFilterInput>;
};

export type AuctionItemSortInput = {
  auctionType?: InputMaybe<SortEnumType>;
  buyNowPrice?: InputMaybe<SortEnumType>;
  category?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  displayOrder?: InputMaybe<SortEnumType>;
  donorName?: InputMaybe<SortEnumType>;
  estimatedValue?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageURL?: InputMaybe<SortEnumType>;
  isDonorPublic?: InputMaybe<SortEnumType>;
  minimumBidIncrement?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  restrictions?: InputMaybe<SortEnumType>;
  startingBid?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
};

export enum AuctionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Closed = 'CLOSED',
  Draft = 'DRAFT',
  NotSet = 'NOT_SET',
  Paid = 'PAID'
}

export type AuctionStatusOperationFilterInput = {
  eq?: InputMaybe<AuctionStatus>;
  in?: InputMaybe<Array<AuctionStatus>>;
  neq?: InputMaybe<AuctionStatus>;
  nin?: InputMaybe<Array<AuctionStatus>>;
};

export enum AuctionType {
  Live = 'LIVE',
  NotSet = 'NOT_SET',
  Silent = 'SILENT'
}

export type AuctionTypeOperationFilterInput = {
  eq?: InputMaybe<AuctionType>;
  in?: InputMaybe<Array<AuctionType>>;
  neq?: InputMaybe<AuctionType>;
  nin?: InputMaybe<Array<AuctionType>>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateAuctionItemInput = {
  auctionType: AuctionType;
  buyNowPrice?: InputMaybe<Scalars['Decimal']['input']>;
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
  donorName: Scalars['String']['input'];
  estimatedValue?: InputMaybe<Scalars['Decimal']['input']>;
  imageURL: Scalars['String']['input'];
  isDonorPublic: Scalars['Boolean']['input'];
  minimumBidIncrement: Scalars['Decimal']['input'];
  name: Scalars['String']['input'];
  restrictions?: InputMaybe<Scalars['String']['input']>;
  startingBid: Scalars['Decimal']['input'];
  status: AuctionStatus;
};

export type CreateUserInput = {
  address: Scalars['String']['input'];
  bidderNumber: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role: UserRole;
  userName: Scalars['String']['input'];
};

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  neq?: InputMaybe<Scalars['Decimal']['input']>;
  ngt?: InputMaybe<Scalars['Decimal']['input']>;
  ngte?: InputMaybe<Scalars['Decimal']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  nlt?: InputMaybe<Scalars['Decimal']['input']>;
  nlte?: InputMaybe<Scalars['Decimal']['input']>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAuctionItemInput = {
  auctionType?: InputMaybe<AuctionType>;
  buyNowPrice?: InputMaybe<Scalars['Decimal']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  donorName?: InputMaybe<Scalars['String']['input']>;
  estimatedValue?: InputMaybe<Scalars['Decimal']['input']>;
  id: Scalars['UUID']['input'];
  imageURL?: InputMaybe<Scalars['String']['input']>;
  isDonorPublic?: InputMaybe<Scalars['Boolean']['input']>;
  minimumBidIncrement?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  restrictions?: InputMaybe<Scalars['String']['input']>;
  startingBid?: InputMaybe<Scalars['Decimal']['input']>;
  status?: InputMaybe<AuctionStatus>;
};

export type UpdateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type UserFilterInput = {
  address?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<UserFilterInput>>;
  bidderNumber?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  passwordHash?: InputMaybe<StringOperationFilterInput>;
  phone?: InputMaybe<StringOperationFilterInput>;
  role?: InputMaybe<UserRoleOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Bidder = 'BIDDER',
  Volunteer = 'VOLUNTEER'
}

export type UserRoleOperationFilterInput = {
  eq?: InputMaybe<UserRole>;
  in?: InputMaybe<Array<UserRole>>;
  neq?: InputMaybe<UserRole>;
  nin?: InputMaybe<Array<UserRole>>;
};

export type UserSortInput = {
  address?: InputMaybe<SortEnumType>;
  bidderNumber?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  passwordHash?: InputMaybe<SortEnumType>;
  phone?: InputMaybe<SortEnumType>;
  role?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type GetAuctionItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuctionItemsQuery = { auctionItems: Array<{ id: string, name: string, description: string, imageURL: string, startingBid: number, minimumBidIncrement: number, buyNowPrice?: number | null, estimatedValue?: number | null, category?: string | null, auctionType: AuctionType, donorName: string, isDonorPublic: boolean, status: AuctionStatus, restrictions: string }> };

export type GetAuctionItemQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAuctionItemQuery = { auctionItems: Array<{ id: string, name: string, description: string, imageURL: string, startingBid: number, minimumBidIncrement: number, buyNowPrice?: number | null, estimatedValue?: number | null, category?: string | null, auctionType: AuctionType, donorName: string, isDonorPublic: boolean, status: AuctionStatus, restrictions: string }> };

export type CreateAuctionItemMutationVariables = Exact<{
  input: CreateAuctionItemInput;
}>;


export type CreateAuctionItemMutation = { createAuctionItem: { id: string, name: string, description: string, imageURL: string, startingBid: number, minimumBidIncrement: number, buyNowPrice?: number | null, estimatedValue?: number | null, category?: string | null, auctionType: AuctionType, donorName: string, isDonorPublic: boolean, status: AuctionStatus, restrictions: string } };

export type UpdateAuctionItemMutationVariables = Exact<{
  input: UpdateAuctionItemInput;
}>;


export type UpdateAuctionItemMutation = { updateAuctionItem: { id: string, name: string, description: string, imageURL: string, startingBid: number, minimumBidIncrement: number, buyNowPrice?: number | null, estimatedValue?: number | null, category?: string | null, auctionType: AuctionType, donorName: string, isDonorPublic: boolean, status: AuctionStatus, restrictions: string } };


export const GetAuctionItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuctionItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auctionItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"startingBid"}},{"kind":"Field","name":{"kind":"Name","value":"minimumBidIncrement"}},{"kind":"Field","name":{"kind":"Name","value":"buyNowPrice"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedValue"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"auctionType"}},{"kind":"Field","name":{"kind":"Name","value":"donorName"}},{"kind":"Field","name":{"kind":"Name","value":"isDonorPublic"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"}}]}}]}}]} as unknown as DocumentNode<GetAuctionItemsQuery, GetAuctionItemsQueryVariables>;
export const GetAuctionItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuctionItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auctionItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"startingBid"}},{"kind":"Field","name":{"kind":"Name","value":"minimumBidIncrement"}},{"kind":"Field","name":{"kind":"Name","value":"buyNowPrice"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedValue"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"auctionType"}},{"kind":"Field","name":{"kind":"Name","value":"donorName"}},{"kind":"Field","name":{"kind":"Name","value":"isDonorPublic"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"}}]}}]}}]} as unknown as DocumentNode<GetAuctionItemQuery, GetAuctionItemQueryVariables>;
export const CreateAuctionItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAuctionItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAuctionItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAuctionItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"startingBid"}},{"kind":"Field","name":{"kind":"Name","value":"minimumBidIncrement"}},{"kind":"Field","name":{"kind":"Name","value":"buyNowPrice"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedValue"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"auctionType"}},{"kind":"Field","name":{"kind":"Name","value":"donorName"}},{"kind":"Field","name":{"kind":"Name","value":"isDonorPublic"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"}}]}}]}}]} as unknown as DocumentNode<CreateAuctionItemMutation, CreateAuctionItemMutationVariables>;
export const UpdateAuctionItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAuctionItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAuctionItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAuctionItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"startingBid"}},{"kind":"Field","name":{"kind":"Name","value":"minimumBidIncrement"}},{"kind":"Field","name":{"kind":"Name","value":"buyNowPrice"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedValue"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"auctionType"}},{"kind":"Field","name":{"kind":"Name","value":"donorName"}},{"kind":"Field","name":{"kind":"Name","value":"isDonorPublic"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"}}]}}]}}]} as unknown as DocumentNode<UpdateAuctionItemMutation, UpdateAuctionItemMutationVariables>;