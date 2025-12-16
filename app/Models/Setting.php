<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'event_name',
        'event_location',
        'primary_color',
        'preview_mode',
        'auction_start',
        'auction_end',
    ];

    protected function casts(): array
    {
        return [
            'preview_mode' => 'boolean',
            'auction_start' => 'datetime',
            'auction_end' => 'datetime',
        ];
    }

    /**
     * Get the singleton settings instance
     */
    public static function get(): self
    {
        return self::firstOrCreate([]);
    }
}
