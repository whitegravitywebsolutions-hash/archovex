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
        // 1. CITIES
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('state')->nullable();
            $table->string('country')->default('India');
            $table->text('description')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('mobile_image')->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('whatsapp')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('status', 20)->default('published');
            $table->integer('sort_order')->default(0);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots', 50)->default('index, follow');
            $table->timestamps();

            $table->index(['status', 'sort_order']);
        });

        // 2. CATEGORIES
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('mobile_image')->nullable();
            $table->string('icon')->nullable();
            $table->string('status', 20)->default('published');
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots', 50)->default('index, follow');
            $table->timestamps();

            $table->index(['status', 'is_featured', 'sort_order']);
        });

        // 3. TAXONOMIES (Rooms, Styles, Materials)
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('styles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. DESIGN POSTS
        Schema::create('design_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->longText('content')->nullable();
            
            $table->string('style')->nullable();
            $table->string('room_type')->nullable();
            $table->string('layout')->nullable();
            $table->string('dimensions')->nullable();
            
            $table->string('colour')->nullable();
            $table->string('material')->nullable();
            $table->string('finish')->nullable();
            
            $table->decimal('budget_min', 12, 2)->nullable();
            $table->decimal('budget_max', 12, 2)->nullable();
            
            $table->string('property_type')->nullable();
            $table->string('area')->nullable();
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('location')->nullable();
            
            $table->string('featured_image')->nullable();
            $table->string('status', 20)->default('published');
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();
            
            $table->string('robots', 50)->default('index, follow');
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();

            $table->index(['category_id', 'status', 'is_featured']);
            $table->index(['city_id', 'status']);
        });

        // 5. DESIGN POST IMAGES
        Schema::create('design_post_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_post_id')->constrained('design_posts')->onDelete('cascade');
            $table->string('image');
            $table->string('thumbnail')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('title')->nullable();
            $table->text('caption')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_mobile')->default(false);
            $table->timestamps();

            $table->index(['design_post_id', 'sort_order']);
        });

        // 6. DESIGN POST FEATURES
        Schema::create('design_post_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_post_id')->constrained('design_posts')->onDelete('cascade');
            $table->string('feature');
            $table->integer('sort_order')->default(0);
        });

        // 7. DESIGN POST SPECIFICATIONS
        Schema::create('design_post_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_post_id')->constrained('design_posts')->onDelete('cascade');
            $table->string('label');
            $table->string('value');
            $table->integer('sort_order')->default(0);
        });

        // 8. DESIGN POST RELATED
        Schema::create('design_post_related', function (Blueprint $table) {
            $table->foreignId('design_post_id')->constrained('design_posts')->onDelete('cascade');
            $table->foreignId('related_design_post_id')->constrained('design_posts')->onDelete('cascade');
            $table->integer('sort_order')->default(0);

            $table->primary(['design_post_id', 'related_design_post_id']);
        });

        // 9. SERVICES
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('icon')->nullable();
            $table->decimal('price_from', 12, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('status', 20)->default('published');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots', 50)->default('index, follow');
            $table->timestamps();
        });

        // 10. PROJECTS
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('client_name')->nullable();
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('property_type')->nullable();
            $table->string('area')->nullable();
            $table->string('budget')->nullable();
            $table->string('duration')->nullable();
            $table->longText('description')->nullable();
            $table->string('featured_image')->nullable();
            $table->date('completion_date')->nullable();
            $table->string('status', 20)->default('published');
            $table->boolean('is_featured')->default(false);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots', 50)->default('index, follow');
            $table->timestamps();
        });

        Schema::create('project_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('image');
            $table->string('caption')->nullable();
            $table->integer('sort_order')->default(0);
        });

        // 11. MENUS & MEGA MENUS
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->default('header');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained('menus')->onDelete('cascade');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('label');
            $table->string('url')->nullable();
            $table->string('type')->default('link'); // link, category, city, megamenu
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('open_new_tab')->default(false);
            $table->timestamps();
        });

        Schema::create('mega_menu_columns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('mega_menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mega_menu_column_id')->constrained('mega_menu_columns')->onDelete('cascade');
            $table->string('label');
            $table->string('url')->nullable();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 12. PAGES & SECTION BUILDER
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->string('status', 20)->default('published');
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots', 50)->default('index, follow');
            $table->timestamps();
        });

        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->nullable()->constrained('pages')->onDelete('cascade');
            $table->string('section_type'); // hero, stats, categories, featured, services, process, cities, projects, testimonials, faq, blog, cta, custom
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->longText('content')->nullable();
            $table->json('settings')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 13. MEDIA LIBRARY
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('file_size');
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('path');
            $table->string('url');
            $table->string('alt_text')->nullable();
            $table->string('title')->nullable();
            $table->text('caption')->nullable();
            $table->string('folder')->default('general');
            $table->timestamps();
        });

        // 14. BLOGS / GUIDES
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('blog_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('author')->default('ARCHOVEX Team');
            $table->foreignId('category_id')->nullable()->constrained('blog_categories')->onDelete('set null');
            $table->string('status', 20)->default('published');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots', 50)->default('index, follow');
            $table->timestamps();
        });

        Schema::create('blog_post_tags', function (Blueprint $table) {
            $table->foreignId('blog_id')->constrained('blogs')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('blog_tags')->onDelete('cascade');
            $table->primary(['blog_id', 'tag_id']);
        });

        // 15. TESTIMONIALS
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('project_type')->nullable();
            $table->text('review');
            $table->integer('rating')->default(5);
            $table->string('image')->nullable();
            $table->string('status', 20)->default('published');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 16. FAQS
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category_slug')->nullable();
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->integer('sort_order')->default(0);
            $table->string('status', 20)->default('published');
            $table->timestamps();
        });

        // 17. LEADS
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('type', 30)->default('consultation'); // consultation, contact, callback
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('property_type')->nullable();
            $table->string('requirement')->nullable();
            $table->string('budget')->nullable();
            $table->text('message')->nullable();
            $table->string('source')->default('website');
            $table->string('status', 30)->default('New'); // New, Contacted, Qualified, Converted, Closed
            $table->string('assigned_to')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 18. SEO METADATA
        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type')->nullable(); // category, post, city, service, project, blog, page
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('path')->unique();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();
            $table->json('json_ld')->nullable();
            $table->string('robots', 50)->default('index, follow');
            $table->timestamps();
        });

        // 19. SETTINGS & SOCIAL LINKS
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->string('url');
            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('seo_metadata');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('blog_post_tags');
        Schema::dropIfExists('blogs');
        Schema::dropIfExists('blog_tags');
        Schema::dropIfExists('blog_categories');
        Schema::dropIfExists('media');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('mega_menu_items');
        Schema::dropIfExists('mega_menu_columns');
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('project_images');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('services');
        Schema::dropIfExists('design_post_related');
        Schema::dropIfExists('design_post_specifications');
        Schema::dropIfExists('design_post_features');
        Schema::dropIfExists('design_post_images');
        Schema::dropIfExists('design_posts');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('styles');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('cities');
    }
};
