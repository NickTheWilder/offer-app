<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'auction_item_id',
        'user_id',
        'amount',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    /**
     * Get the user that owns the bid.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the auction item that the bid belongs to.
     */
    public function auctionItem()
    {
        return $this->belongsTo(AuctionItem::class);
    }
}
