<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuctionItem extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'starting_bid',
        'minimum_bid_increment',
        'buy_now_price',
        'estimated_value',
        'category',
        'auction_type',
        'donor_id',
        'donor_name',
        'is_donor_public',
        'status',
        'restrictions',
        'display_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starting_bid' => 'decimal:2',
            'minimum_bid_increment' => 'decimal:2',
            'buy_now_price' => 'decimal:2',
            'estimated_value' => 'decimal:2',
            'is_donor_public' => 'boolean',
        ];
    }

    /**
     * Get the files for the auction item.
     */
    public function files()
    {
        return $this->hasMany(AuctionItemFile::class);
    }

    /**
     * Get the bids for the auction item.
     */
    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    /**
     * Get the current high bid for the auction item.
     */
    public function currentHighBid()
    {
        return $this->hasOne(Bid::class)->latestOfMany('amount');
    }

    /**
     * Get the donor (user) for the auction item.
     */
    public function donor()
    {
        return $this->belongsTo(User::class, 'donor_id');
    }
}
