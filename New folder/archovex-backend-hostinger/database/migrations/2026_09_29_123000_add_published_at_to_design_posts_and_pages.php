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
        if (Schema::hasTable('design_posts') && !Schema::hasColumn('design_posts', 'published_at')) {
            Schema::table('design_posts', function (Blueprint $table) {
                $table->timestamp('published_at')->nullable()->after('status');
                $table->index('published_at');
            });
        }

        if (Schema::hasTable('pages') && !Schema::hasColumn('pages', 'published_at')) {
            Schema::table('pages', function (Blueprint $table) {
                $table->timestamp('published_at')->nullable()->after('status');
                $table->index('published_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('design_posts') && Schema::hasColumn('design_posts', 'published_at')) {
            Schema::table('design_posts', function (Blueprint $table) {
                $table->dropColumn('published_at');
            });
        }

        if (Schema::hasTable('pages') && Schema::hasColumn('pages', 'published_at')) {
            Schema::table('pages', function (Blueprint $table) {
                $table->dropColumn('published_at');
            });
        }
    }
};
