type AdminDataType = "items" | "donors" | "users" | "reports";

interface FetchOptions<T> {
    type: AdminDataType;
    currentData: T | null;
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    setData: (data: T) => void;
    setError: (error: string) => void;
}

export async function fetchAdminData<T>({
    type,
    currentData,
    isLoading,
    setLoading,
    setData,
    setError,
}: FetchOptions<T>): Promise<void> {
    // Don't fetch if we already have data or are currently loading
    if (currentData || isLoading) return;

    setLoading(true);
    setError("");

    try {
        const response = await fetch(`/api/admin/${type}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${type}`);
        }

        const data = await response.json();
        setData(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${type}`;
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
}
