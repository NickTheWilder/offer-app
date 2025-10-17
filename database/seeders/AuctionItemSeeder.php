<?php

namespace Database\Seeders;

use App\Models\AuctionItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuctionItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to assign as donors
        $users = User::where('role', 'bidder')->get();
        
        $items = [
            [
                'name' => 'Handmade Quilt',
                'description' => 'A beautiful handcrafted quilt made by our talented church members. Features intricate patterns and high-quality materials.',
                'starting_bid' => 150.00,
                'minimum_bid_increment' => 10.00,
                'buy_now_price' => 400.00,
                'category' => 'Handmade Crafts',
            ],
            [
                'name' => 'Weekend Cabin Getaway',
                'description' => 'Enjoy a relaxing weekend at a scenic mountain cabin. Sleeps up to 6 people. Valid for one year from purchase date.',
                'starting_bid' => 200.00,
                'minimum_bid_increment' => 25.00,
                'buy_now_price' => 600.00,
                'category' => 'Experiences',
            ],
            [
                'name' => 'Home-Baked Pies',
                'description' => 'A dozen freshly baked pies of your choice delivered monthly for 6 months. Choose from apple, cherry, pecan, and more!',
                'starting_bid' => 100.00,
                'minimum_bid_increment' => 10.00,
                'buy_now_price' => 300.00,
                'category' => 'Food & Baking',
            ],
            [
                'name' => 'Professional Photo Session',
                'description' => 'One-hour professional photography session including family portraits, editing, and 20 digital prints.',
                'starting_bid' => 75.00,
                'minimum_bid_increment' => 10.00,
                'buy_now_price' => 200.00,
                'category' => 'Services',
            ],
            [
                'name' => 'Hand-Carved Wooden Cross',
                'description' => 'A stunning hand-carved wooden cross, perfect for home or church display. Crafted from solid oak.',
                'starting_bid' => 50.00,
                'minimum_bid_increment' => 5.00,
                'buy_now_price' => 150.00,
                'category' => 'Religious Items',
            ],
            [
                'name' => 'Garden Care Package',
                'description' => 'Full season of garden maintenance including planting, weeding, and seasonal care for your home garden.',
                'starting_bid' => 125.00,
                'minimum_bid_increment' => 15.00,
                'buy_now_price' => 350.00,
                'category' => 'Services',
            ],
            [
                'name' => 'Gourmet Dinner Party',
                'description' => 'A private chef will prepare a 5-course gourmet dinner for up to 8 guests in your home.',
                'starting_bid' => 300.00,
                'minimum_bid_increment' => 25.00,
                'buy_now_price' => 800.00,
                'category' => 'Experiences',
            ],
            [
                'name' => 'Handmade Toy Chest',
                'description' => 'A beautifully crafted wooden toy chest with safety hinges. Perfect for children\'s rooms. Custom engraving included.',
                'starting_bid' => 100.00,
                'minimum_bid_increment' => 10.00,
                'buy_now_price' => 275.00,
                'category' => 'Handmade Crafts',
            ],
            [
                'name' => 'Spa Day Package',
                'description' => 'Full day spa experience including massage, facial, manicure, and pedicure at a local luxury spa.',
                'starting_bid' => 150.00,
                'minimum_bid_increment' => 20.00,
                'buy_now_price' => 400.00,
                'category' => 'Experiences',
            ],
            [
                'name' => 'Wine Tasting Tour',
                'description' => 'Private wine tasting tour for 4 at a local vineyard, including lunch and a bottle of wine to take home.',
                'starting_bid' => 200.00,
                'minimum_bid_increment' => 25.00,
                'buy_now_price' => 500.00,
                'category' => 'Experiences',
            ],
        ];

        foreach ($items as $index => $item) {
            // Assign a random donor from the users, or leave as null for some items
            $donor = $users->isNotEmpty() && ($index % 3 !== 0) ? $users->random() : null;
            
            AuctionItem::create([
                'name' => $item['name'],
                'description' => $item['description'],
                'starting_bid' => $item['starting_bid'],
                'minimum_bid_increment' => $item['minimum_bid_increment'],
                'buy_now_price' => $item['buy_now_price'],
                'category' => $item['category'],
                'auction_type' => 'silent',
                'donor_id' => $donor?->id,
                'donor_name' => $donor ? $donor->name : 'Anonymous Donor',
                'is_donor_public' => $donor ? true : false,
                'status' => 'active',
                'display_order' => $index + 1,
            ]);
        }
    }
}
