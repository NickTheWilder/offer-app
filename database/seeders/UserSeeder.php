<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'bidder_number' => null,
            'phone' => '832-555-0100',
            'address' => '123 Admin St',
        ]);

        // Create bidder users
        $bidders = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'bidder_number' => '1'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'bidder_number' => '2'],
            ['name' => 'Bob Johnson', 'email' => 'bob@example.com', 'bidder_number' => '3'],
            ['name' => 'Alice Williams', 'email' => 'alice@example.com', 'bidder_number' => '4'],
            ['name' => 'Charlie Brown', 'email' => 'charlie@example.com', 'bidder_number' => '5'],
        ];

        foreach ($bidders as $index => $bidder) {
            User::create([
                'name' => $bidder['name'],
                'email' => $bidder['email'],
                'password' => Hash::make('password'),
                'role' => 'bidder',
                'bidder_number' => $bidder['bidder_number'],
                'phone' => '832-555-' . str_pad((string)($index + 1), 4, '0', STR_PAD_LEFT),
                'address' => ($index + 1) . ' Bidder Lane',
            ]);
        }
    }
}
