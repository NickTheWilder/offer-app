import { AuctionItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ShoppingCart } from "lucide-react";
import styles from "./buy-now-modal.module.css";

interface BuyNowModalProps {
  item: AuctionItem;
  onClose: () => void;
}

export default function BuyNowModal({ item, onClose }: BuyNowModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Submit buy now mutation
  const buyNowMutation = useMutation({
    mutationFn: async () => {
      if (!item.buyNowPrice) {
        throw new Error("This item does not have a buy now price");
      }
      
      const bid = {
        itemId: item.id,
        amount: item.buyNowPrice,
        isBuyNow: true
      };
      
      const res = await apiRequest("POST", "/api/bids", bid);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/bids/item/${item.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/bids/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      
      // Show success toast
      toast({
        title: "Purchase successful",
        description: `You have successfully purchased ${item.name} for ${formatCurrency(item.buyNowPrice)}.`,
      });
      
      // Close the modal
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to complete purchase",
        variant: "destructive",
      });
    }
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Buy Now Confirmation</h2>
          <p className={styles.modalDescription}>
            Confirm your purchase of this item at the buy now price.
          </p>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.itemPreview}>
            <div className={styles.iconContainer}>
              <ShoppingCart className={styles.cartIcon} />
            </div>
            <h4 className={styles.itemName}>{item.name}</h4>
            <p className={styles.buyNowPrice}>Buy now price: {formatCurrency(item.buyNowPrice)}</p>
          </div>
          
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              By proceeding, you agree to purchase this item immediately at the buy now price. 
              This will end the auction for this item.
            </p>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton}
            onClick={() => buyNowMutation.mutate()}
            disabled={buyNowMutation.isPending}
          >
            {buyNowMutation.isPending ? (
              <>
                <Loader2 className={styles.spinnerIcon} />
                Processing...
              </>
            ) : (
              "Confirm Purchase"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
