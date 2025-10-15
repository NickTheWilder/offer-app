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
        Schema::create('auction_item_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_item_id')->constrained('auction_items')->onDelete('cascade');
            $table->string('file_name');
            $table->string('original_file_name');
            $table->string('content_type');
            $table->integer('file_size');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_item_files');
    }
};
