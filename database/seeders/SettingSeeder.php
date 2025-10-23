<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'event_name' => 'Church Bazaar 2025',
            'event_location' => 'Fellowship Hall',
            'primary_color' => '#348feb',
            'auction_start' => null,
            'auction_end' => null,
        ]);
    }
}
