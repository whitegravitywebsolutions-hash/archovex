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
        if (!Schema::hasTable('leads')) {
            Schema::create('leads', function (Blueprint $table) {
                $table->id();
                $table->string('type', 30)->default('consultation');
                $table->string('name');
                $table->string('phone');
                $table->string('email')->nullable();
                $table->text('address')->nullable();
                $table->string('property_type')->nullable();
                $table->text('requirement')->nullable();
                $table->string('budget')->nullable();
                $table->text('message')->nullable();
                $table->string('source')->default('website');
                $table->string('status', 30)->default('New');
                $table->string('assigned_to')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
