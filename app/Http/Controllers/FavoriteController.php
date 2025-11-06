<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Toggle favorite status for an auction item.
     */
    public function toggle(string $auctionItemId)
    {
        $userId = Auth::id();

        $favorite = Favorite::where('user_id', $userId)
            ->where('auction_item_id', $auctionItemId)
            ->first();

        if ($favorite) {
            // Remove favorite
            $favorite->delete();

            return response()->json([
                'success' => true,
                'favorited' => false,
                'message' => 'Item removed from favorites',
            ]);
        }

        // Add favorite
        Favorite::create([
            'user_id' => $userId,
            'auction_item_id' => $auctionItemId,
        ]);

        return response()->json([
            'success' => true,
            'favorited' => true,
            'message' => 'Item added to favorites',
        ]);
    }

    /**
     * Get all favorites for the authenticated user.
     */
    public function index()
    {
        $favorites = Favorite::with(['auctionItem.files'])
            ->where('user_id', Auth::id())
            ->get();

        return response()->json([
            'success' => true,
            'favorites' => $favorites,
        ]);
    }
}
