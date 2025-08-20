import type { JSX } from 'react';
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { z } from "zod";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/services/api";
import type { User } from "../types/schema";
import { insertUserSchema } from "../types/schema";

/**
 * Authentication Context Provider
 *
 * This file has been refactored to use mock API services instead of real API calls.
 * In a real application with a backend, you would replace these mock service calls
 * with actual API calls using fetch/axios.
 */

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: UseMutationResult<User, Error, LoginData>;
    logoutMutation: UseMutationResult<void, Error, void>;
    registerMutation: UseMutationResult<User, Error, RegisterData>;
};

// Only require email and password for login
type LoginData = {
    email: string;
    password: string;
};

// Extends the insertUserSchema for registration
export const registerSchema = insertUserSchema.omit({ role: true });
type RegisterData = z.infer<typeof registerSchema>;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const { toast } = useToast();

    // Use the mock API service to get the current user
    const {
        data: user,
        error,
        isLoading,
    } = useQuery<User | null, Error>({
        queryKey: ["/api/user"],
        queryFn: async () => {
            try {
                return await getCurrentUser();
            } catch (error) {
                console.error(error);
                return null;
            }
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginData) => {
            return await loginUser(credentials.email, credentials.password);
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Login successful",
                description: `Welcome back, ${user.name}!`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (userData: RegisterData) => {
            return await registerUser(userData);
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Registration successful",
                description: `Welcome, ${user.name}!`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await logoutUser();
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                error,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
