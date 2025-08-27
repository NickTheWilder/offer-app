/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    /** The `Byte` scalar type represents non-fractional whole numeric values. Byte can represent values between 0 and 255. */
    Byte: { input: any; output: any };
    /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
    DateTime: { input: string; output: string };
    /** The `Decimal` scalar type represents a decimal floating-point number. */
    Decimal: { input: number; output: number };
    /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
    Long: { input: number; output: number };
    UUID: { input: string; output: string };
    /** The `Upload` scalar type represents a file upload. */
    Upload: { input: any; output: any };
};

export type AuctionItemFileFilterInput = {
    and?: InputMaybe<Array<AuctionItemFileFilterInput>>;
    auctionItem?: InputMaybe<AuctionItemFilterInput>;
    auctionItemId?: InputMaybe<UuidOperationFilterInput>;
    contentType?: InputMaybe<StringOperationFilterInput>;
    fileData?: InputMaybe<ListByteOperationFilterInput>;
    fileName?: InputMaybe<StringOperationFilterInput>;
    fileSize?: InputMaybe<LongOperationFilterInput>;
    id?: InputMaybe<UuidOperationFilterInput>;
    isPrimary?: InputMaybe<BooleanOperationFilterInput>;
    or?: InputMaybe<Array<AuctionItemFileFilterInput>>;
    originalFileName?: InputMaybe<StringOperationFilterInput>;
    uploadedAt?: InputMaybe<DateTimeOperationFilterInput>;
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
    files?: InputMaybe<ListFilterInputTypeOfAuctionItemFileFilterInput>;
    id?: InputMaybe<UuidOperationFilterInput>;
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
    isDonorPublic?: InputMaybe<SortEnumType>;
    minimumBidIncrement?: InputMaybe<SortEnumType>;
    name?: InputMaybe<SortEnumType>;
    restrictions?: InputMaybe<SortEnumType>;
    startingBid?: InputMaybe<SortEnumType>;
    status?: InputMaybe<SortEnumType>;
};

export enum AuctionStatus {
    Active = "ACTIVE",
    Cancelled = "CANCELLED",
    Closed = "CLOSED",
    Draft = "DRAFT",
    NotSet = "NOT_SET",
    Paid = "PAID",
}

export type AuctionStatusOperationFilterInput = {
    eq?: InputMaybe<AuctionStatus>;
    in?: InputMaybe<Array<AuctionStatus>>;
    neq?: InputMaybe<AuctionStatus>;
    nin?: InputMaybe<Array<AuctionStatus>>;
};

export enum AuctionType {
    Live = "LIVE",
    NotSet = "NOT_SET",
    Silent = "SILENT",
}

export type AuctionTypeOperationFilterInput = {
    eq?: InputMaybe<AuctionType>;
    in?: InputMaybe<Array<AuctionType>>;
    neq?: InputMaybe<AuctionType>;
    nin?: InputMaybe<Array<AuctionType>>;
};

export type BooleanOperationFilterInput = {
    eq?: InputMaybe<Scalars["Boolean"]["input"]>;
    neq?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ByteOperationFilterInput = {
    eq?: InputMaybe<Scalars["Byte"]["input"]>;
    gt?: InputMaybe<Scalars["Byte"]["input"]>;
    gte?: InputMaybe<Scalars["Byte"]["input"]>;
    in?: InputMaybe<Array<InputMaybe<Scalars["Byte"]["input"]>>>;
    lt?: InputMaybe<Scalars["Byte"]["input"]>;
    lte?: InputMaybe<Scalars["Byte"]["input"]>;
    neq?: InputMaybe<Scalars["Byte"]["input"]>;
    ngt?: InputMaybe<Scalars["Byte"]["input"]>;
    ngte?: InputMaybe<Scalars["Byte"]["input"]>;
    nin?: InputMaybe<Array<InputMaybe<Scalars["Byte"]["input"]>>>;
    nlt?: InputMaybe<Scalars["Byte"]["input"]>;
    nlte?: InputMaybe<Scalars["Byte"]["input"]>;
};

export type CreateAuctionItemInput = {
    auctionType: AuctionType;
    buyNowPrice?: InputMaybe<Scalars["Decimal"]["input"]>;
    category: Scalars["String"]["input"];
    description: Scalars["String"]["input"];
    donorName: Scalars["String"]["input"];
    estimatedValue?: InputMaybe<Scalars["Decimal"]["input"]>;
    files?: InputMaybe<Array<Scalars["Upload"]["input"]>>;
    isDonorPublic: Scalars["Boolean"]["input"];
    minimumBidIncrement: Scalars["Decimal"]["input"];
    name: Scalars["String"]["input"];
    restrictions?: InputMaybe<Scalars["String"]["input"]>;
    startingBid: Scalars["Decimal"]["input"];
    status: AuctionStatus;
};

export type CreateUserInput = {
    address: Scalars["String"]["input"];
    bidderNumber: Scalars["String"]["input"];
    email: Scalars["String"]["input"];
    password: Scalars["String"]["input"];
    phone: Scalars["String"]["input"];
    role: UserRole;
    userName: Scalars["String"]["input"];
};

export type DateTimeOperationFilterInput = {
    eq?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]["input"]>>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    neq?: InputMaybe<Scalars["DateTime"]["input"]>;
    ngt?: InputMaybe<Scalars["DateTime"]["input"]>;
    ngte?: InputMaybe<Scalars["DateTime"]["input"]>;
    nin?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]["input"]>>>;
    nlt?: InputMaybe<Scalars["DateTime"]["input"]>;
    nlte?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type DecimalOperationFilterInput = {
    eq?: InputMaybe<Scalars["Decimal"]["input"]>;
    gt?: InputMaybe<Scalars["Decimal"]["input"]>;
    gte?: InputMaybe<Scalars["Decimal"]["input"]>;
    in?: InputMaybe<Array<InputMaybe<Scalars["Decimal"]["input"]>>>;
    lt?: InputMaybe<Scalars["Decimal"]["input"]>;
    lte?: InputMaybe<Scalars["Decimal"]["input"]>;
    neq?: InputMaybe<Scalars["Decimal"]["input"]>;
    ngt?: InputMaybe<Scalars["Decimal"]["input"]>;
    ngte?: InputMaybe<Scalars["Decimal"]["input"]>;
    nin?: InputMaybe<Array<InputMaybe<Scalars["Decimal"]["input"]>>>;
    nlt?: InputMaybe<Scalars["Decimal"]["input"]>;
    nlte?: InputMaybe<Scalars["Decimal"]["input"]>;
};

export type IntOperationFilterInput = {
    eq?: InputMaybe<Scalars["Int"]["input"]>;
    gt?: InputMaybe<Scalars["Int"]["input"]>;
    gte?: InputMaybe<Scalars["Int"]["input"]>;
    in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
    lt?: InputMaybe<Scalars["Int"]["input"]>;
    lte?: InputMaybe<Scalars["Int"]["input"]>;
    neq?: InputMaybe<Scalars["Int"]["input"]>;
    ngt?: InputMaybe<Scalars["Int"]["input"]>;
    ngte?: InputMaybe<Scalars["Int"]["input"]>;
    nin?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
    nlt?: InputMaybe<Scalars["Int"]["input"]>;
    nlte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type ListByteOperationFilterInput = {
    all?: InputMaybe<ByteOperationFilterInput>;
    any?: InputMaybe<Scalars["Boolean"]["input"]>;
    none?: InputMaybe<ByteOperationFilterInput>;
    some?: InputMaybe<ByteOperationFilterInput>;
};

export type ListFilterInputTypeOfAuctionItemFileFilterInput = {
    all?: InputMaybe<AuctionItemFileFilterInput>;
    any?: InputMaybe<Scalars["Boolean"]["input"]>;
    none?: InputMaybe<AuctionItemFileFilterInput>;
    some?: InputMaybe<AuctionItemFileFilterInput>;
};

export type LongOperationFilterInput = {
    eq?: InputMaybe<Scalars["Long"]["input"]>;
    gt?: InputMaybe<Scalars["Long"]["input"]>;
    gte?: InputMaybe<Scalars["Long"]["input"]>;
    in?: InputMaybe<Array<InputMaybe<Scalars["Long"]["input"]>>>;
    lt?: InputMaybe<Scalars["Long"]["input"]>;
    lte?: InputMaybe<Scalars["Long"]["input"]>;
    neq?: InputMaybe<Scalars["Long"]["input"]>;
    ngt?: InputMaybe<Scalars["Long"]["input"]>;
    ngte?: InputMaybe<Scalars["Long"]["input"]>;
    nin?: InputMaybe<Array<InputMaybe<Scalars["Long"]["input"]>>>;
    nlt?: InputMaybe<Scalars["Long"]["input"]>;
    nlte?: InputMaybe<Scalars["Long"]["input"]>;
};

export enum SortEnumType {
    Asc = "ASC",
    Desc = "DESC",
}

export type StringOperationFilterInput = {
    and?: InputMaybe<Array<StringOperationFilterInput>>;
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    eq?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
    ncontains?: InputMaybe<Scalars["String"]["input"]>;
    nendsWith?: InputMaybe<Scalars["String"]["input"]>;
    neq?: InputMaybe<Scalars["String"]["input"]>;
    nin?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
    nstartsWith?: InputMaybe<Scalars["String"]["input"]>;
    or?: InputMaybe<Array<StringOperationFilterInput>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateAuctionItemInput = {
    auctionType?: InputMaybe<AuctionType>;
    buyNowPrice?: InputMaybe<Scalars["Decimal"]["input"]>;
    category?: InputMaybe<Scalars["String"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    donorName?: InputMaybe<Scalars["String"]["input"]>;
    estimatedValue?: InputMaybe<Scalars["Decimal"]["input"]>;
    files?: InputMaybe<Array<Scalars["Upload"]["input"]>>;
    id: Scalars["UUID"]["input"];
    isDonorPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
    minimumBidIncrement?: InputMaybe<Scalars["Decimal"]["input"]>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    restrictions?: InputMaybe<Scalars["String"]["input"]>;
    startingBid?: InputMaybe<Scalars["Decimal"]["input"]>;
    status?: InputMaybe<AuctionStatus>;
};

export type UpdateUserInput = {
    address?: InputMaybe<Scalars["String"]["input"]>;
    email?: InputMaybe<Scalars["String"]["input"]>;
    id: Scalars["UUID"]["input"];
    isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
    phone?: InputMaybe<Scalars["String"]["input"]>;
    role?: InputMaybe<UserRole>;
    userName?: InputMaybe<Scalars["String"]["input"]>;
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
    Admin = "ADMIN",
    Bidder = "BIDDER",
    Volunteer = "VOLUNTEER",
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
    eq?: InputMaybe<Scalars["UUID"]["input"]>;
    gt?: InputMaybe<Scalars["UUID"]["input"]>;
    gte?: InputMaybe<Scalars["UUID"]["input"]>;
    in?: InputMaybe<Array<InputMaybe<Scalars["UUID"]["input"]>>>;
    lt?: InputMaybe<Scalars["UUID"]["input"]>;
    lte?: InputMaybe<Scalars["UUID"]["input"]>;
    neq?: InputMaybe<Scalars["UUID"]["input"]>;
    ngt?: InputMaybe<Scalars["UUID"]["input"]>;
    ngte?: InputMaybe<Scalars["UUID"]["input"]>;
    nin?: InputMaybe<Array<InputMaybe<Scalars["UUID"]["input"]>>>;
    nlt?: InputMaybe<Scalars["UUID"]["input"]>;
    nlte?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type AuctionItemFragment = {
    id: string;
    name: string;
    description?: string | null;
    startingBid: number;
    minimumBidIncrement: number;
    buyNowPrice?: number | null;
    estimatedValue?: number | null;
    category?: string | null;
    auctionType: AuctionType;
    donorName: string;
    isDonorPublic: boolean;
    status: AuctionStatus;
    restrictions?: string | null;
    files?: Array<{ id: string; fileName: string; originalFileName: string; contentType: string; fileSize: number; uploadedAt: string; isPrimary: boolean; dataUrl?: string | null } | null> | null;
} & { " $fragmentName"?: "AuctionItemFragment" };

export type GetAuctionItemsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAuctionItemsQuery = { auctionItems: Array<{ " $fragmentRefs"?: { AuctionItemFragment: AuctionItemFragment } }> };

export type GetAuctionItemQueryVariables = Exact<{
    id: Scalars["UUID"]["input"];
}>;

export type GetAuctionItemQuery = { auctionItems: Array<{ " $fragmentRefs"?: { AuctionItemFragment: AuctionItemFragment } }> };

export type CreateAuctionItemMutationVariables = Exact<{
    input: CreateAuctionItemInput;
}>;

export type CreateAuctionItemMutation = { createAuctionItem: { " $fragmentRefs"?: { AuctionItemFragment: AuctionItemFragment } } };

export type UpdateAuctionItemMutationVariables = Exact<{
    input: UpdateAuctionItemInput;
}>;

export type UpdateAuctionItemMutation = { updateAuctionItem: { " $fragmentRefs"?: { AuctionItemFragment: AuctionItemFragment } } };

export type DeleteAuctionItemMutationVariables = Exact<{
    id: Scalars["UUID"]["input"];
}>;

export type DeleteAuctionItemMutation = { deleteAuctionItem: { " $fragmentRefs"?: { AuctionItemFragment: AuctionItemFragment } } };

export const AuctionItemFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuctionItem" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuctionItem" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "files" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "fileName" } },
                                { kind: "Field", name: { kind: "Name", value: "originalFileName" } },
                                { kind: "Field", name: { kind: "Name", value: "contentType" } },
                                { kind: "Field", name: { kind: "Name", value: "fileSize" } },
                                { kind: "Field", name: { kind: "Name", value: "uploadedAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isPrimary" } },
                                { kind: "Field", name: { kind: "Name", value: "dataUrl" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "startingBid" } },
                    { kind: "Field", name: { kind: "Name", value: "minimumBidIncrement" } },
                    { kind: "Field", name: { kind: "Name", value: "buyNowPrice" } },
                    { kind: "Field", name: { kind: "Name", value: "estimatedValue" } },
                    { kind: "Field", name: { kind: "Name", value: "category" } },
                    { kind: "Field", name: { kind: "Name", value: "auctionType" } },
                    { kind: "Field", name: { kind: "Name", value: "donorName" } },
                    { kind: "Field", name: { kind: "Name", value: "isDonorPublic" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    { kind: "Field", name: { kind: "Name", value: "restrictions" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AuctionItemFragment, unknown>;
export const GetAuctionItemsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetAuctionItems" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [{ kind: "Field", name: { kind: "Name", value: "auctionItems" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuctionItem" } }] } }],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuctionItem" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuctionItem" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "files" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "fileName" } },
                                { kind: "Field", name: { kind: "Name", value: "originalFileName" } },
                                { kind: "Field", name: { kind: "Name", value: "contentType" } },
                                { kind: "Field", name: { kind: "Name", value: "fileSize" } },
                                { kind: "Field", name: { kind: "Name", value: "uploadedAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isPrimary" } },
                                { kind: "Field", name: { kind: "Name", value: "dataUrl" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "startingBid" } },
                    { kind: "Field", name: { kind: "Name", value: "minimumBidIncrement" } },
                    { kind: "Field", name: { kind: "Name", value: "buyNowPrice" } },
                    { kind: "Field", name: { kind: "Name", value: "estimatedValue" } },
                    { kind: "Field", name: { kind: "Name", value: "category" } },
                    { kind: "Field", name: { kind: "Name", value: "auctionType" } },
                    { kind: "Field", name: { kind: "Name", value: "donorName" } },
                    { kind: "Field", name: { kind: "Name", value: "isDonorPublic" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    { kind: "Field", name: { kind: "Name", value: "restrictions" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAuctionItemsQuery, GetAuctionItemsQueryVariables>;
export const GetAuctionItemDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetAuctionItem" },
            variableDefinitions: [{ kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "id" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } } } }],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "auctionItems" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "where" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "id" },
                                            value: { kind: "ObjectValue", fields: [{ kind: "ObjectField", name: { kind: "Name", value: "eq" }, value: { kind: "Variable", name: { kind: "Name", value: "id" } } }] },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuctionItem" } }] },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuctionItem" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuctionItem" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "files" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "fileName" } },
                                { kind: "Field", name: { kind: "Name", value: "originalFileName" } },
                                { kind: "Field", name: { kind: "Name", value: "contentType" } },
                                { kind: "Field", name: { kind: "Name", value: "fileSize" } },
                                { kind: "Field", name: { kind: "Name", value: "uploadedAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isPrimary" } },
                                { kind: "Field", name: { kind: "Name", value: "dataUrl" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "startingBid" } },
                    { kind: "Field", name: { kind: "Name", value: "minimumBidIncrement" } },
                    { kind: "Field", name: { kind: "Name", value: "buyNowPrice" } },
                    { kind: "Field", name: { kind: "Name", value: "estimatedValue" } },
                    { kind: "Field", name: { kind: "Name", value: "category" } },
                    { kind: "Field", name: { kind: "Name", value: "auctionType" } },
                    { kind: "Field", name: { kind: "Name", value: "donorName" } },
                    { kind: "Field", name: { kind: "Name", value: "isDonorPublic" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    { kind: "Field", name: { kind: "Name", value: "restrictions" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAuctionItemQuery, GetAuctionItemQueryVariables>;
export const CreateAuctionItemDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CreateAuctionItem" },
            variableDefinitions: [
                { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "input" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "CreateAuctionItemInput" } } } },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createAuctionItem" },
                        arguments: [{ kind: "Argument", name: { kind: "Name", value: "input" }, value: { kind: "Variable", name: { kind: "Name", value: "input" } } }],
                        selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuctionItem" } }] },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuctionItem" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuctionItem" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "files" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "fileName" } },
                                { kind: "Field", name: { kind: "Name", value: "originalFileName" } },
                                { kind: "Field", name: { kind: "Name", value: "contentType" } },
                                { kind: "Field", name: { kind: "Name", value: "fileSize" } },
                                { kind: "Field", name: { kind: "Name", value: "uploadedAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isPrimary" } },
                                { kind: "Field", name: { kind: "Name", value: "dataUrl" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "startingBid" } },
                    { kind: "Field", name: { kind: "Name", value: "minimumBidIncrement" } },
                    { kind: "Field", name: { kind: "Name", value: "buyNowPrice" } },
                    { kind: "Field", name: { kind: "Name", value: "estimatedValue" } },
                    { kind: "Field", name: { kind: "Name", value: "category" } },
                    { kind: "Field", name: { kind: "Name", value: "auctionType" } },
                    { kind: "Field", name: { kind: "Name", value: "donorName" } },
                    { kind: "Field", name: { kind: "Name", value: "isDonorPublic" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    { kind: "Field", name: { kind: "Name", value: "restrictions" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateAuctionItemMutation, CreateAuctionItemMutationVariables>;
export const UpdateAuctionItemDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "UpdateAuctionItem" },
            variableDefinitions: [
                { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "input" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "UpdateAuctionItemInput" } } } },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateAuctionItem" },
                        arguments: [{ kind: "Argument", name: { kind: "Name", value: "input" }, value: { kind: "Variable", name: { kind: "Name", value: "input" } } }],
                        selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuctionItem" } }] },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuctionItem" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuctionItem" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "files" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "fileName" } },
                                { kind: "Field", name: { kind: "Name", value: "originalFileName" } },
                                { kind: "Field", name: { kind: "Name", value: "contentType" } },
                                { kind: "Field", name: { kind: "Name", value: "fileSize" } },
                                { kind: "Field", name: { kind: "Name", value: "uploadedAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isPrimary" } },
                                { kind: "Field", name: { kind: "Name", value: "dataUrl" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "startingBid" } },
                    { kind: "Field", name: { kind: "Name", value: "minimumBidIncrement" } },
                    { kind: "Field", name: { kind: "Name", value: "buyNowPrice" } },
                    { kind: "Field", name: { kind: "Name", value: "estimatedValue" } },
                    { kind: "Field", name: { kind: "Name", value: "category" } },
                    { kind: "Field", name: { kind: "Name", value: "auctionType" } },
                    { kind: "Field", name: { kind: "Name", value: "donorName" } },
                    { kind: "Field", name: { kind: "Name", value: "isDonorPublic" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    { kind: "Field", name: { kind: "Name", value: "restrictions" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateAuctionItemMutation, UpdateAuctionItemMutationVariables>;
export const DeleteAuctionItemDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "DeleteAuctionItem" },
            variableDefinitions: [{ kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "id" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } } } }],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deleteAuctionItem" },
                        arguments: [{ kind: "Argument", name: { kind: "Name", value: "id" }, value: { kind: "Variable", name: { kind: "Name", value: "id" } } }],
                        selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuctionItem" } }] },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuctionItem" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuctionItem" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "files" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "fileName" } },
                                { kind: "Field", name: { kind: "Name", value: "originalFileName" } },
                                { kind: "Field", name: { kind: "Name", value: "contentType" } },
                                { kind: "Field", name: { kind: "Name", value: "fileSize" } },
                                { kind: "Field", name: { kind: "Name", value: "uploadedAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isPrimary" } },
                                { kind: "Field", name: { kind: "Name", value: "dataUrl" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "startingBid" } },
                    { kind: "Field", name: { kind: "Name", value: "minimumBidIncrement" } },
                    { kind: "Field", name: { kind: "Name", value: "buyNowPrice" } },
                    { kind: "Field", name: { kind: "Name", value: "estimatedValue" } },
                    { kind: "Field", name: { kind: "Name", value: "category" } },
                    { kind: "Field", name: { kind: "Name", value: "auctionType" } },
                    { kind: "Field", name: { kind: "Name", value: "donorName" } },
                    { kind: "Field", name: { kind: "Name", value: "isDonorPublic" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    { kind: "Field", name: { kind: "Name", value: "restrictions" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteAuctionItemMutation, DeleteAuctionItemMutationVariables>;
