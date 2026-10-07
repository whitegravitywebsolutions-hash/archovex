<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('design_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('design_posts', 'category_ids')) {
                $table->json('category_ids')->nullable()->after('category_id');
            }
            if (!Schema::hasColumn('design_posts', 'city_ids')) {
                $table->json('city_ids')->nullable()->after('city_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('design_posts', function (Blueprint $table) {
            if (Schema::hasColumn('design_posts', 'category_ids')) {
                $table->dropColumn('category_ids');
            }
            if (Schema::hasColumn('design_posts', 'city_ids')) {
                $table->dropColumn('city_ids');
            }
        });
    }
};
