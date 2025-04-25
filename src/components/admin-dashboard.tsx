import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuctionItem, insertAuctionItemSchema } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, Loader2, Check, Ban, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

// Item form schema for validation
const itemFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  startingBid: z.coerce.number().min(0.01, "Starting bid must be greater than 0"),
  minimumBidIncrement: z.coerce.number().min(0.01, "Increment must be greater than 0").default(5),
  buyNowPrice: z.coerce.number().min(0.01, "Buy now price must be greater than 0").optional().nullable(),
  estimatedValue: z.coerce.number().min(0.01, "Value must be greater than 0").optional().nullable(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  donorName: z.string().optional().nullable(),
  donorPublic: z.boolean().default(false),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "active", "sold", "unsold"]).default("draft"),
  restrictions: z.string().optional().nullable(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeAdminTab, setActiveAdminTab] = useState("items");
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AuctionItem | null>(null);
  
  // Fetch auction items for admin
  const { data: items, isLoading } = useQuery<AuctionItem[]>({
    queryKey: ["/api/items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    }
  });
  
  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormValues) => {
      const formattedData = {
        ...data,
        images: data.images || [],
        tags: data.tags || [],
        startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
        endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
      };
      
      const res = await apiRequest(
        "POST", 
        "/api/items", 
        formattedData
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setItemDialogOpen(false);
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
    }
  });
  
  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async (data: ItemFormValues & { id: number }) => {
      const { id, ...itemData } = data;
      const formattedData = {
        ...itemData,
        images: itemData.images || [],
        tags: itemData.tags || [],
        startTime: itemData.startTime ? new Date(itemData.startTime).toISOString() : null,
        endTime: itemData.endTime ? new Date(itemData.endTime).toISOString() : null,
      };
      
      const res = await apiRequest(
        "PUT", 
        `/api/items/${id}`, 
        formattedData
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setItemDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    }
  });
  
  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    }
  });
  
  // Item form
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
      startingBid: 0,
      minimumBidIncrement: 5,
      buyNowPrice: null,
      estimatedValue: null,
      category: "",
      tags: [],
      donorName: "",
      donorPublic: false,
      startTime: null,
      endTime: null,
      status: "draft",
      restrictions: "",
    }
  });
  
  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Open add item dialog
  const handleAddItem = () => {
    setEditingItem(null);
    form.reset({
      name: "",
      description: "",
      images: [],
      startingBid: 0,
      minimumBidIncrement: 5,
      buyNowPrice: null,
      estimatedValue: null,
      category: "",
      tags: [],
      donorName: "",
      donorPublic: false,
      startTime: null,
      endTime: null,
      status: "draft",
      restrictions: "",
    });
    setItemDialogOpen(true);
  };
  
  // Open edit item dialog
  const handleEditItem = (item: AuctionItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description || "",
      images: item.images || [],
      startingBid: item.startingBid,
      minimumBidIncrement: item.minimumBidIncrement,
      buyNowPrice: item.buyNowPrice,
      estimatedValue: item.estimatedValue,
      category: item.category,
      tags: item.tags || [],
      donorName: item.donorName,
      donorPublic: item.donorPublic,
      startTime: item.startTime ? new Date(item.startTime).toISOString().substring(0, 16) : null,
      endTime: item.endTime ? new Date(item.endTime).toISOString().substring(0, 16) : null,
      status: item.status,
      restrictions: item.restrictions,
    });
    setItemDialogOpen(true);
  };
  
  // Handle form submission
  const onSubmit = (data: ItemFormValues) => {
    if (editingItem) {
      updateItemMutation.mutate({
        ...data,
        id: editingItem.id
      });
    } else {
      createItemMutation.mutate(data);
    }
  };
  
  // Handle item deletion
  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="font-heading text-xl font-semibold text-neutral-800 mb-4 md:mb-0">
            Auction Management
          </h2>
          <Button className="bg-primary-500 hover:bg-primary-600" onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
        
        {/* Admin tabs */}
        <Tabs value={activeAdminTab} onValueChange={setActiveAdminTab}>
          <TabsList className="mb-6 border-b border-gray-200 w-full justify-start">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          {/* Items Tab */}
          <TabsContent value="items">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : !items || items.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <PlusCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-heading font-medium text-lg text-gray-700 mb-2">No auction items</h3>
                <p className="text-gray-500 text-sm mb-4">Add your first auction item to get started.</p>
                <Button className="bg-primary-500 hover:bg-primary-600" onClick={handleAddItem}>
                  Add New Item
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item #</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Bid</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.startingBid)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'active' ? 'bg-green-100 text-green-800' :
                            item.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            item.status === 'published' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.endTime 
                            ? new Date(item.endTime).toLocaleString()
                            : "Not set"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary-500 hover:text-primary-700"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 hover:text-gray-700 ml-2"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          {/* Other Tabs (Placeholder/Future Implementation) */}
          <TabsContent value="bids">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="font-heading font-medium text-lg text-gray-700 mb-2">Bid Management</h3>
              <p className="text-gray-500 text-sm">View and manage all bids across auction items.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="font-heading font-medium text-lg text-gray-700 mb-2">User Management</h3>
              <p className="text-gray-500 text-sm">Manage user accounts and permissions.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="font-heading font-medium text-lg text-gray-700 mb-2">Reports</h3>
              <p className="text-gray-500 text-sm">Generate and view auction reports.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Item Form Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Auction Item" : "Add New Auction Item"}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Home Goods, Experiences" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the item..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startingBid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Bid *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="pl-7" 
                            step="0.01"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minimumBidIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Bid Increment</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input 
                            type="number" 
                            placeholder="5.00" 
                            className="pl-7" 
                            step="0.01"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="buyNowPrice"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Buy Now Price (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="pl-7" 
                            step="0.01"
                            value={value === null ? "" : value}
                            onChange={(e) => onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="unsold">Unsold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Donor Name (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Donor name" 
                          value={value === null ? "" : value}
                          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Start Time (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          value={value === null ? "" : value}
                          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>End Time (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          value={value === null ? "" : value}
                          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="restrictions"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Restrictions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any restrictions or conditions..." 
                          className="resize-none" 
                          value={value === null ? "" : value}
                          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setItemDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createItemMutation.isPending || updateItemMutation.isPending}
                >
                  {(createItemMutation.isPending || updateItemMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingItem ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {editingItem ? "Update Item" : "Create Item"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
