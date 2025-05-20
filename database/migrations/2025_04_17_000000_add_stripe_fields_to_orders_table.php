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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_intent_id')->nullable()->after('payment_status');
            $table->string('payment_method_id')->nullable()->after('payment_intent_id');
            $table->string('payment_error')->nullable()->after('payment_method_id');
            $table->timestamp('payment_completed_at')->nullable()->after('payment_error');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_intent_id',
                'payment_method_id',
                'payment_error',
                'payment_completed_at'
            ]);
        });
    }
};
