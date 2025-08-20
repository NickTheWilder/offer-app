import type { JSX } from React;
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { getAuctionItems, getItemCategories, createAuctionItem, updateAuctionItem } from "@/services/graphql-api";
import { AuctionItem } from "@/types/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import styles from "./admin-dashboard.module.css"; // TODO: this would be better as a separate file

export function AddNewItemForm(): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [newItemMode, setNewItemMode] = useState(false);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Fetch auction items for admin
  const { data: items, isLoading } = useQuery<AuctionItem[]>({
      queryKey: ["/api/items"],
      queryFn: async () => {
          return await getAuctionItems();
      },
  });

  // Fetch categories
  const { data: categories } = useQuery<string[]>({
      queryKey: ["/api/categories"],
      queryFn: async () => {
          return await getItemCategories();
      },
  });

  // Create item mutation
  const createItemMutation = useMutation({
      mutationFn: async (data: any) => {
          const formattedData = {
              ...data,
              images: data.images || [],
              tags: data.tags || [],
              auctionType: "silent" as const,
              displayOrder: 0,
              startTime: data.startTime ? new Date(data.startTime) : null,
              endTime: data.endTime ? new Date(data.endTime) : null,
          };

          return await createAuctionItem(formattedData);
      },
      onSuccess: (newItem: any) => {
          queryClient.invalidateQueries({ queryKey: ["/api/items"] });
          queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
          setSelectedItem(newItem);
          setNewItemMode(false);
          toast({
              title: "Success",
              description: "Item created successfully",
          });
      },
      onError: (error: any) => {
          toast({
              title: "Error",
              description: error.message || "Failed to create item",
              variant: "destructive",
          });
      },
  });

  const updateItemMutation = useMutation({
      mutationFn: async (data: ItemFormValues & { id: number }) => {
          const { id, ...itemData } = data;
          const formattedData = {
              ...itemData,
              images: itemData.images || [],
              tags: itemData.tags || [],
              auctionType: "silent" as const,
              displayOrder: 0,
              startTime: itemData.startTime ? new Date(itemData.startTime) : null,
              endTime: itemData.endTime ? new Date(itemData.endTime) : null,
          };

          return await updateAuctionItem(id, formattedData);
      },
      onSuccess: (updatedItem) => {
          queryClient.invalidateQueries({ queryKey: ["/api/items"] });
          queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
          setSelectedItem(updatedItem);
          toast({
              title: "Success",
              description: "Item updated successfully",
          });
      },
      onError: (error) => {
          toast({
              title: "Error",
              description: error.message || "Failed to update item",
              variant: "destructive",
          });
      },
  });

  // Handle form submission
  const onSubmit = (data: any) => {
      if (selectedItem) {
          updateItemMutation.mutate({
              ...data,
              id: selectedItem.id,
          });
      } else {
          createItemMutation.mutate(data);
      }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
      form.setValue("category", category);
      setCategoryDropdownOpen(false);
  };

  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
      setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  return (
  <form onSubmit={form.handleSubmit(onSubmit)} className={styles.itemForm}>
      <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>{selectedItem ? "Edit Item" : "Add New Item"}</h2>
      </div>

      <div className={styles.formGrid}>
          <div className={styles.formLeftColumn}>
              {/* Basic Item Information */}
              <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                      Name<span className={styles.requiredMark}>*</span>
                  </label>
                  <input className={styles.formInput} {...form.register("name")} placeholder="Item name" />
                  {form.formState.errors.name && <p className={styles.formError}>{form.formState.errors.name.message}</p>}
              </div>

              <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                      Starting Bid<span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.currencyInput}>
                      <span className={styles.currencySymbol}>$</span>
                      <input className={styles.formInput} type="number" step="0.01" {...form.register("startingBid")} placeholder="0.00" />
                  </div>
                  {form.formState.errors.startingBid && <p className={styles.formError}>{form.formState.errors.startingBid.message}</p>}
              </div>

              <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Buy Now Price</label>
                  <div className={styles.currencyInput}>
                      <span className={styles.currencySymbol}>$</span>
                      <input className={styles.formInput} type="number" step="0.01" {...form.register("buyNowPrice")} placeholder="0.00" />
                  </div>
                  {form.formState.errors.buyNowPrice && <p className={styles.formError}>{form.formState.errors.buyNowPrice.message}</p>}
              </div>

              <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                      Category<span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.categorySelect}>
                      <div className={styles.selectedCategory} onClick={toggleCategoryDropdown}>
                          <span>{form.watch("category") || "Select category"}</span>
                          <ChevronDown className={styles.dropdownIcon} />
                      </div>
                      {categoryDropdownOpen && (
                          <div className={styles.categoryDropdown}>
                              {categories && categories.length > 0 ? (
                                  categories.map((category) => (
                                      <div key={category} className={styles.categoryOption} onClick={() => handleCategorySelect(category)}>
                                          {category}
                                      </div>
                                  ))
                              ) : (
                                  <div className={styles.categoryOption}>
                                      <input
                                          type="text"
                                          placeholder="Enter new category"
                                          {...form.register("category")}
                                          className={styles.newCategoryInput}
                                          autoFocus
                                          onBlur={() => setCategoryDropdownOpen(false)}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                  setCategoryDropdownOpen(false);
                                              }
                                          }}
                                      />
                                  </div>
                              )}
                              {categories && categories.length > 0 && (
                                  <div className={styles.categoryOption}>
                                      <input
                                          type="text"
                                          placeholder="Or enter new category"
                                          className={styles.newCategoryInput}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                  form.setValue("category", e.currentTarget.value.trim());
                                                  setCategoryDropdownOpen(false);
                                              }
                                          }}
                                          onBlur={() => setCategoryDropdownOpen(false)}
                                      />
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
                  {form.formState.errors.category && <p className={styles.formError}>{form.formState.errors.category.message}</p>}
              </div>
          </div>
        </div>
    </form>
  );
}
