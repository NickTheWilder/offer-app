<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $fillable = [
        'transaction_id',
        'user_id',
        'auction_item_id',
        'amount',
        'sale_source',
        'quantity',
        'notes',
        'sale_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'sale_date' => 'date',
    ];

    /**
     * @return BelongsTo<User,Sale>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<AuctionItem,Sale>
     */
    public function auctionItem(): BelongsTo
    {
        return $this->belongsTo(AuctionItem::class);
    }
}
