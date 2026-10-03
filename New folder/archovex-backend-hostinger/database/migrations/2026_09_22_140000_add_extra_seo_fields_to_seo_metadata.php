<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('seo_metadata', function (Blueprint $table) {
            if (!Schema::hasColumn('seo_metadata', 'focus_keyphrase')) {
                $table->string('focus_keyphrase')->nullable();
            }
            if (!Schema::hasColumn('seo_metadata', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('seo_metadata', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('seo_metadata', 'og_url')) {
                $table->string('og_url')->nullable();
            }
            if (!Schema::hasColumn('seo_metadata', 'og_type')) {
                $table->string('og_type')->nullable()->default('website');
            }
            if (!Schema::hasColumn('seo_metadata', 'og_site_name')) {
                $table->string('og_site_name')->nullable()->default('ARCHOVEX INFRA PRIVATE LIMITED');
            }
            if (!Schema::hasColumn('seo_metadata', 'twitter_card')) {
                $table->string('twitter_card')->nullable()->default('summary_large_image');
            }
            if (!Schema::hasColumn('seo_metadata', 'twitter_site')) {
                $table->string('twitter_site')->nullable()->default('@archovexinfra');
            }
            if (!Schema::hasColumn('seo_metadata', 'schema_code')) {
                $table->longText('schema_code')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('seo_metadata', function (Blueprint $table) {
            $table->dropColumn([
                'focus_keyphrase',
                'robots_index',
                'robots_follow',
                'og_url',
                'og_type',
                'og_site_name',
                'twitter_card',
                'twitter_site',
                'schema_code',
            ]);
        });
    }
};
