import { useMutation } from "@apollo/client";
import { toast } from "@/hooks/use-toast";
import { CREATE_AUCTION_ITEM, UPDATE_AUCTION_ITEM, GET_AUCTION_ITEMS } from "@/lib/graphql-queries";
import type { CreateAuctionItemInput, UpdateAuctionItemInput } from "@/types/generated/graphql";
import { extractValidationErrors } from "@/lib/error-handling";

interface MutationHandlers {
    onSuccess: () => void;
    setFieldError: (fieldName: string, message: string) => void;
}

export function useCreateAuctionItem({ onSuccess, setFieldError }: MutationHandlers): ReturnType<typeof useMutation> {
    return useMutation(CREATE_AUCTION_ITEM, {
        onCompleted: () => {
            onSuccess();
            toast({
                title: "Success",
                description: "Item created successfully",
            });
        },
        onError: (error) => {
            console.error("Auction item creation failed:", error);
            handleMutationError(error, setFieldError);
            toast({
                title: "Failed to create item",
                description: "Please check your input and try again. If the problem persists, contact support.",
                variant: "destructive",
            });
        },
        refetchQueries: [GET_AUCTION_ITEMS],
        awaitRefetchQueries: true,
    });
}

export function useUpdateAuctionItem({ onSuccess, setFieldError }: MutationHandlers): ReturnType<typeof useMutation> {
    return useMutation(UPDATE_AUCTION_ITEM, {
        onCompleted: () => {
            onSuccess();
            toast({
                title: "Success",
                description: "Item updated successfully",
            });
        },
        onError: (error) => {
            console.error("Auction item update failed:", error);
            handleMutationError(error, setFieldError);
            toast({
                title: "Failed to update item",
                description: "Please check your input and try again. If the problem persists, contact support.",
                variant: "destructive",
            });
        },
        refetchQueries: [GET_AUCTION_ITEMS],
        awaitRefetchQueries: true,
    });
}

function handleMutationError(error: unknown, setFieldError: (fieldName: string, message: string) => void): void {
    const validationErrors = extractValidationErrors(error);
    validationErrors.forEach(({ fieldName, message }) => {
        setFieldError(fieldName, message);
    });
}

export type { CreateAuctionItemInput, UpdateAuctionItemInput };
