<?php

namespace Database\Seeders;

use App\Models\Sale;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::all();
        $auctionItems = \App\Models\AuctionItem::all();

        $saleData = [
            ['source' => 'pre_sale', 'amount' => [25.00, 50.00, 75.00, 100.00], 'quantities' => [1, 2, 1, 1]],
            ['source' => 'auction', 'amount' => [150.00, 250.00, 75.00, 300.00], 'quantities' => [1, 1, 1, 1]],
            ['source' => 'raffle', 'amount' => [5.00, 10.00, 20.00], 'quantities' => [2, 4, 1]],
            ['source' => 'day_of', 'amount' => [15.00, 30.00, 45.00, 60.00], 'quantities' => [1, 2, 1, 3]],
            ['source' => 'underwriting', 'amount' => [500.00, 1000.00, 250.00], 'quantities' => [1, 1, 1]],
        ];

        $notes = [
            'Cash payment at registration table',
            'Credit card payment via Square',
            'Check payment - memo: Church Bazaar',
            'Venmo payment received',
            'Won during live auction',
            'Pre-event online purchase',
            'Raffle ticket bundle purchase',
            'Day-of merchandise sale',
            'Corporate sponsorship payment',
            null, // Some sales have no notes
        ];

        foreach ($users as $user) {
            $numSales = rand(3, 5);

            for ($i = 0; $i < $numSales; $i++) {
                $sourceData = $saleData[array_rand($saleData)];
                $amountIndex = array_rand($sourceData['amount']);

                Sale::create([
                    'transaction_id' => 'TXN'.strtoupper(uniqid()),
                    'user_id' => $user->id,
                    'auction_item_id' => $sourceData['source'] === 'auction' && $auctionItems->isNotEmpty()
                        ? $auctionItems->random()->id
                        : null,
                    'amount' => $sourceData['amount'][$amountIndex],
                    'sale_source' => $sourceData['source'],
                    'quantity' => $sourceData['quantities'][$amountIndex] ?? 1,
                    'notes' => $notes[array_rand($notes)],
                    'sale_date' => now()->subDays(rand(0, 30))->format('Y-m-d'),
                ]);
            }
        }
    }
}
