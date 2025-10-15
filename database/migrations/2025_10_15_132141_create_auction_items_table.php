<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('auction_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('starting_bid', 10, 2);
            $table->decimal('minimum_bid_increment', 10, 2);
            $table->decimal('buy_now_price', 10, 2)->nullable();
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->string('category')->nullable();
            $table->enum('auction_type', ['silent', 'live'])->default('silent');
            $table->string('donor_name');
            $table->boolean('is_donor_public')->default(true);
            $table->enum('status', ['draft', 'active', 'closed', 'paid', 'cancelled'])->default('draft');
            $table->text('restrictions')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_items');
    }
};
