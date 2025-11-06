<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'auction_item_id',
    ];

    /**
     * Get the user that owns the favorite.
     *
     * @return BelongsTo<User,Favorite>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the auction item that is favorited.
     *
     * @return BelongsTo<AuctionItem,Favorite>
     */
    public function auctionItem(): BelongsTo
    {
        return $this->belongsTo(AuctionItem::class);
    }
}
