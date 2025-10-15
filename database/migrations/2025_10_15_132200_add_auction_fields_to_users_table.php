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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'bidder', 'volunteer'])->default('bidder')->after('email_verified_at');
            $table->string('bidder_number')->unique()->nullable()->after('role');
            $table->string('phone')->nullable()->after('bidder_number');
            $table->text('address')->nullable()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'bidder_number', 'phone', 'address']);
        });
    }
};
