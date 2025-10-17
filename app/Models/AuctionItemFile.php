<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AuctionItemFile extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'auction_item_id',
        'file_name',
        'original_file_name',
        'content_type',
        'file_size',
        'is_primary',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = ['url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'file_size' => 'integer',
        ];
    }

    /**
     * Get the auction item that the file belongs to.
     */
    public function auctionItem()
    {
        return $this->belongsTo(AuctionItem::class);
    }

    /**
     * Get the URL for the file.
     */
    public function getUrlAttribute(): string
    {
        return Storage::url('auction-items/' . $this->file_name);
    }
}
