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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique()->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('set null');
            $table->foreignId('auction_item_id')->nullable()->constrained('auction_items')->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->enum('sale_source', ['pre_sale', 'auction', 'raffle', 'day_of', 'other', 'underwriting'])->default('underwriting');
            $table->integer('quantity');
            $table->string('notes')->nullable();
            $table->date('sale_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
