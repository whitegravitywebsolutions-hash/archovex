<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SeoMetadata;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::withCount('designPosts');

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $categories = $query->orderBy('sort_order', 'asc')->get();

        return response()->json(['success' => true, 'data' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'mobile_image' => 'nullable|string',
            'icon' => 'nullable|string',
            'status' => 'required|string|in:published,draft,archived',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'robots' => 'nullable|string',
            'seo_data' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = Category::create($validated);

        // Sync 15 Strapi-style SEO fields to seo_metadata table
        if (!empty($category->slug)) {
            $seoInput = $request->input('seo_data', []);
            SeoMetadata::updateOrCreate(
                ['path' => '/designs/' . $category->slug],
                [
                    'meta_title' => $seoInput['meta_title'] ?? $validated['meta_title'] ?? $category->name,
                    'meta_description' => $seoInput['meta_description'] ?? $validated['meta_description'] ?? $category->short_description,
                    'focus_keyphrase' => $seoInput['focus_keyphrase'] ?? null,
                    'canonical_url' => $seoInput['canonical_url'] ?? null,
                    'robots_index' => isset($seoInput['robots_index']) ? (bool)$seoInput['robots_index'] : true,
                    'robots_follow' => isset($seoInput['robots_follow']) ? (bool)$seoInput['robots_follow'] : true,
                    'og_title' => $seoInput['og_title'] ?? null,
                    'og_description' => $seoInput['og_description'] ?? null,
                    'og_url' => $seoInput['og_url'] ?? null,
                    'og_type' => $seoInput['og_type'] ?? 'website',
                    'og_site_name' => $seoInput['og_site_name'] ?? null,
                    'og_image' => $seoInput['og_image'] ?? $category->image,
                    'twitter_card' => $seoInput['twitter_card'] ?? 'summary_large_image',
                    'twitter_site' => $seoInput['twitter_site'] ?? null,
                    'schema_code' => $seoInput['schema_code'] ?? null,
                ]
            );
        }

        $catData = $category->toArray();
        $catData['seo_data'] = SeoMetadata::where('path', '/designs/' . $category->slug)->first();

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $catData
        ], 201);
    }

    public function show($id)
    {
        $category = Category::withCount('designPosts')->findOrFail($id);
        $seo = SeoMetadata::where('path', '/designs/' . $category->slug)->first();
        $catData = $category->toArray();
        $catData['seo_data'] = $seo;

        return response()->json(['success' => true, 'data' => $catData]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'mobile_image' => 'nullable|string',
            'icon' => 'nullable|string',
            'status' => 'required|string|in:published,draft,archived',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'robots' => 'nullable|string',
            'seo_data' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        // Sync 15 Strapi-style SEO fields to seo_metadata table
        if (!empty($category->slug)) {
            $seoInput = $request->input('seo_data', []);
            SeoMetadata::updateOrCreate(
                ['path' => '/designs/' . $category->slug],
                [
                    'meta_title' => $seoInput['meta_title'] ?? $validated['meta_title'] ?? $category->name,
                    'meta_description' => $seoInput['meta_description'] ?? $validated['meta_description'] ?? $category->short_description,
                    'focus_keyphrase' => $seoInput['focus_keyphrase'] ?? null,
                    'canonical_url' => $seoInput['canonical_url'] ?? null,
                    'robots_index' => isset($seoInput['robots_index']) ? (bool)$seoInput['robots_index'] : true,
                    'robots_follow' => isset($seoInput['robots_follow']) ? (bool)$seoInput['robots_follow'] : true,
                    'og_title' => $seoInput['og_title'] ?? null,
                    'og_description' => $seoInput['og_description'] ?? null,
                    'og_url' => $seoInput['og_url'] ?? null,
                    'og_type' => $seoInput['og_type'] ?? 'website',
                    'og_site_name' => $seoInput['og_site_name'] ?? null,
                    'og_image' => $seoInput['og_image'] ?? $category->image,
                    'twitter_card' => $seoInput['twitter_card'] ?? 'summary_large_image',
                    'twitter_site' => $seoInput['twitter_site'] ?? null,
                    'schema_code' => $seoInput['schema_code'] ?? null,
                ]
            );
        }

        $catData = $category->toArray();
        $catData['seo_data'] = SeoMetadata::where('path', '/designs/' . $category->slug)->first();

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $catData
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }
}
