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
        if (Schema::hasTable('pages')) {
            if (!Schema::hasColumn('pages', 'sections')) {
                Schema::table('pages', function (Blueprint $table) {
                    $table->json('sections')->nullable()->after('content');
                });
            }
        } else {
            Schema::create('pages', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->longText('content')->nullable();
                $table->json('sections')->nullable();
                $table->string('status')->default('published');
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->string('canonical_url')->nullable();
                $table->string('og_title')->nullable();
                $table->string('og_description')->nullable();
                $table->string('og_image')->nullable();
                $table->string('robots')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('pages') && Schema::hasColumn('pages', 'sections')) {
            Schema::table('pages', function (Blueprint $table) {
                $table->dropColumn('sections');
            });
        }
    }
};
