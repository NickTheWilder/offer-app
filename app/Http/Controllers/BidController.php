<?php

namespace App\Http\Controllers;

use App\Models\AuctionItem;
use App\Models\Bid;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BidController extends Controller
{
    /**
     * Store a new bid for an auction item.
     */
    public function store(Request $request, string $auctionItem)
    {
        $item = AuctionItem::with('currentHighBid')->findOrFail($auctionItem);

        // Validate the auction item is active
        if ($item->status !== 'active') {
            return back()->withErrors([
                'amount' => 'This auction item is not currently accepting bids.',
            ]);
        }

        // Get current high bid
        $currentHighBid = $item->currentHighBid;
        $minimumBid = $currentHighBid
            ? $currentHighBid->amount + $item->minimum_bid_increment
            : $item->starting_bid;

        // Validate bid amount
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:'.$minimumBid],
        ]);

        // Prevent user from outbidding themselves
        if ($currentHighBid && $currentHighBid->user_id === Auth::id()) {
            return back()->withErrors([
                'amount' => 'You are already the highest bidder on this item.',
            ]);
        }

        // Create the bid within a transaction to ensure data consistency
        try {
            $bid = DB::transaction(function () use ($item, $validated) {
                return Bid::create([
                    'auction_item_id' => $item->id,
                    'user_id' => Auth::id(),
                    'amount' => $validated['amount'],
                ]);
            });

            // Load the user relationship for the response
            $bid->load('user');

            return back()->with([
                'success' => 'Bid placed successfully!',
                'bid' => $bid,
            ]);

        } catch (\Exception $e) {
            return back()->withErrors([
                'amount' => 'Failed to place bid. Please try again.',
            ]);
        }
    }

    /**
     * Get all bids for a specific auction item.
     */
    public function index(string $auctionItem)
    {
        $item = AuctionItem::findOrFail($auctionItem);

        $bids = Bid::with('user:id,name,bidder_number')
            ->where('auction_item_id', $item->id)
            ->orderBy('amount', 'desc')
            ->orderBy('created_at', 'asc') // If amounts are equal, first bid wins
            ->get();

        return response()->json([
            'success' => true,
            'bids' => $bids,
        ]);
    }

    /**
     * Get all bids placed by the authenticated user.
     */
    public function userBids()
    {
        $bids = Bid::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // Return just the array of bids
        return response()->json($bids);
    }

    /**
     * Delete a bid.
     *
     * @param  mixed  $id
     * @return RedirectResponse
     */
    public function destroy($id)
    {
        $bid = Bid::findOrFail($id);

        $bid->delete();

        return back()->with('success', 'Bid deleted successfully.');
    }
}
