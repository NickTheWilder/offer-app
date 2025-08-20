import type { JSX } from "react";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { getItemCategories, createAuctionItem, updateAuctionItem } from "@/services/graphql-api";
import type { AuctionItem } from "@/types/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import styles from "./admin-dashboard.module.css"; // TODO: this would be better as a separate file

type ItemFormValues = {
  name: string;
  description?: string;
  images?: string[];
  startingBid: number;
  minimumBidIncrement: number;
  buyNowPrice?: number;
  estimatedValue?: number;
  category: string;
  tags?: string[];
  donorName?: string;
  donorPublic: boolean;
  startTime?: string;
  endTime?: string;
  status: "draft" | "published" | "active" | "sold" | "unsold";
  restrictions?: string;
};

interface AddNewItemFormProps {
  form: any; // TanStack form instance 
  selectedItem: AuctionItem | null;
  onSuccess: () => void;
}

export function AddNewItemForm({ form, selectedItem, onSuccess }: AddNewItemFormProps): JSX.Element {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Fetch categories
  const { data: categories } = useQuery<string[]>({
      queryKey: ["/api/categories"],
      queryFn: async () => {
          return await getItemCategories();
      },
  });

  // Create item mutation
  const createItemMutation = useMutation({
      mutationFn: async (data: ItemFormValues) => {
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
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/items"] });
          queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
          onSuccess();
          toast({
              title: "Success",
              description: "Item created successfully",
          });
      },
      onError: (error: Error) => {
          toast({
              title: "Error",
              description: error.message || "Failed to create item",
              variant: "destructive",
          });
      },
  });

  // Update item mutation
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
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/items"] });
          queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
          onSuccess();
          toast({
              title: "Success",
              description: "Item updated successfully",
          });
      },
      onError: (error: Error) => {
          toast({
              title: "Error",
              description: error.message || "Failed to update item",
              variant: "destructive",
          });
      },
  });


  // Handle category selection
  const handleCategorySelect = (category: string) => {
      form.setFieldValue("category", category);
      setCategoryDropdownOpen(false);
  };

  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
      setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  return (
    <div className={styles.itemForm}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Get form values and submit
            const formData = {
              name: form.getFieldValue("name") || "",
              startingBid: form.getFieldValue("startingBid") || 0,
              buyNowPrice: form.getFieldValue("buyNowPrice"),
              category: form.getFieldValue("category") || "",
              description: form.getFieldValue("description") || "",
              images: form.getFieldValue("images") || [],
              minimumBidIncrement: form.getFieldValue("minimumBidIncrement") || 5,
              estimatedValue: form.getFieldValue("estimatedValue"),
              tags: form.getFieldValue("tags") || [],
              donorName: form.getFieldValue("donorName") || "",
              donorPublic: form.getFieldValue("donorPublic") || false,
              startTime: form.getFieldValue("startTime") || "",
              endTime: form.getFieldValue("endTime") || "",
              status: form.getFieldValue("status") || "draft",
              restrictions: form.getFieldValue("restrictions") || "",
            };

            if (selectedItem) {
              updateItemMutation.mutate({
                ...formData,
                id: selectedItem.id,
              });
            } else {
              createItemMutation.mutate(formData);
            }
          }}
        >
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
                <input
                  className={styles.formInput}
                  name="name"
                  value={form.getFieldValue("name") || ""}
                  onChange={(e) => form.setFieldValue("name", e.target.value)}
                  placeholder="Item name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Starting Bid<span className={styles.requiredMark}>*</span>
                </label>
                <div className={styles.currencyInput}>
                  <span className={styles.currencySymbol}>$</span>
                  <input
                    className={styles.formInput}
                    type="number"
                    step="0.01"
                    name="startingBid"
                    value={form.getFieldValue("startingBid") || 0}
                    onChange={(e) => form.setFieldValue("startingBid", Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Buy Now Price</label>
                <div className={styles.currencyInput}>
                  <span className={styles.currencySymbol}>$</span>
                  <input
                    className={styles.formInput}
                    type="number"
                    step="0.01"
                    name="buyNowPrice"
                    value={form.getFieldValue("buyNowPrice") || ''}
                    onChange={(e) => form.setFieldValue("buyNowPrice", e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Category<span className={styles.requiredMark}>*</span>
                </label>
                <div className={styles.categorySelect}>
                  <div className={styles.selectedCategory} onClick={toggleCategoryDropdown}>
                    <span>{form.getFieldValue("category") || "Select category"}</span>
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
                                      value={form.getFieldValue("category") || ''}
                                      onChange={(e) => form.setFieldValue("category", e.target.value)}
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
                                              form.setFieldValue("category", e.currentTarget.value.trim());
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
              </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
            >
              {selectedItem ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
        </form>
    </div>
  );
}
