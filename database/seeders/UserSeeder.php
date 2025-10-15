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
            'phone' => '555-0100',
            'address' => '123 Admin St',
        ]);

        // Create bidder users
        $bidders = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'bidder_number' => 'B0001'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'bidder_number' => 'B0002'],
            ['name' => 'Bob Johnson', 'email' => 'bob@example.com', 'bidder_number' => 'B0003'],
            ['name' => 'Alice Williams', 'email' => 'alice@example.com', 'bidder_number' => 'B0004'],
            ['name' => 'Charlie Brown', 'email' => 'charlie@example.com', 'bidder_number' => 'B0005'],
        ];

        foreach ($bidders as $index => $bidder) {
            User::create([
                'name' => $bidder['name'],
                'email' => $bidder['email'],
                'password' => Hash::make('password'),
                'role' => 'bidder',
                'bidder_number' => $bidder['bidder_number'],
                'phone' => '555-' . str_pad((string)($index + 1), 4, '0', STR_PAD_LEFT),
                'address' => ($index + 1) . ' Bidder Lane',
            ]);
        }
    }
}
