<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SeoMetadata;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPageController extends Controller
{
    public function index(Request $request)
    {
        $query = Page::query();

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where('title', 'like', "%{$s}%")
                ->orWhere('slug', 'like', "%{$s}%");
        }

        $pages = $query->orderBy('updated_at', 'desc')->get();

        return response()->json(['success' => true, 'data' => $pages]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'status' => 'required|string|in:published,draft',
            'sections' => 'nullable|array',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'seo_data' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page = Page::create($validated);

        // Sync 15 Strapi-style SEO fields to seo_metadata table
        $pagePath = $page->slug === 'home' ? '/' : '/' . ltrim($page->slug, '/');
        $seoInput = $request->input('seo_data', []);
        SeoMetadata::updateOrCreate(
            ['path' => $pagePath],
            [
                'meta_title' => $seoInput['meta_title'] ?? $validated['meta_title'] ?? $page->title,
                'meta_description' => $seoInput['meta_description'] ?? $validated['meta_description'] ?? null,
                'focus_keyphrase' => $seoInput['focus_keyphrase'] ?? null,
                'canonical_url' => $seoInput['canonical_url'] ?? null,
                'robots_index' => isset($seoInput['robots_index']) ? (bool)$seoInput['robots_index'] : true,
                'robots_follow' => isset($seoInput['robots_follow']) ? (bool)$seoInput['robots_follow'] : true,
                'og_title' => $seoInput['og_title'] ?? null,
                'og_description' => $seoInput['og_description'] ?? null,
                'og_url' => $seoInput['og_url'] ?? null,
                'og_type' => $seoInput['og_type'] ?? 'website',
                'og_site_name' => $seoInput['og_site_name'] ?? null,
                'og_image' => $seoInput['og_image'] ?? null,
                'twitter_card' => $seoInput['twitter_card'] ?? 'summary_large_image',
                'twitter_site' => $seoInput['twitter_site'] ?? null,
                'schema_code' => $seoInput['schema_code'] ?? null,
            ]
        );

        $pageData = $page->toArray();
        $pageData['seo_data'] = SeoMetadata::where('path', $pagePath)->first();

        return response()->json([
            'success' => true,
            'message' => 'Page created successfully',
            'data' => $pageData
        ], 201);
    }

    public function show($id)
    {
        $page = Page::findOrFail($id);
        $pagePath = $page->slug === 'home' ? '/' : '/' . ltrim($page->slug, '/');
        $seo = SeoMetadata::where('path', $pagePath)->first();
        
        $pageData = $page->toArray();
        $pageData['seo_data'] = $seo;

        return response()->json(['success' => true, 'data' => $pageData]);
    }

    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $id,
            'status' => 'required|string|in:published,draft',
            'sections' => 'nullable|array',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'seo_data' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page->update($validated);

        // Sync 15 Strapi-style SEO fields to seo_metadata table
        $pagePath = $page->slug === 'home' ? '/' : '/' . ltrim($page->slug, '/');
        $seoInput = $request->input('seo_data', []);
        SeoMetadata::updateOrCreate(
            ['path' => $pagePath],
            [
                'meta_title' => $seoInput['meta_title'] ?? $validated['meta_title'] ?? $page->title,
                'meta_description' => $seoInput['meta_description'] ?? $validated['meta_description'] ?? null,
                'focus_keyphrase' => $seoInput['focus_keyphrase'] ?? null,
                'canonical_url' => $seoInput['canonical_url'] ?? null,
                'robots_index' => isset($seoInput['robots_index']) ? (bool)$seoInput['robots_index'] : true,
                'robots_follow' => isset($seoInput['robots_follow']) ? (bool)$seoInput['robots_follow'] : true,
                'og_title' => $seoInput['og_title'] ?? null,
                'og_description' => $seoInput['og_description'] ?? null,
                'og_url' => $seoInput['og_url'] ?? null,
                'og_type' => $seoInput['og_type'] ?? 'website',
                'og_site_name' => $seoInput['og_site_name'] ?? null,
                'og_image' => $seoInput['og_image'] ?? null,
                'twitter_card' => $seoInput['twitter_card'] ?? 'summary_large_image',
                'twitter_site' => $seoInput['twitter_site'] ?? null,
                'schema_code' => $seoInput['schema_code'] ?? null,
            ]
        );

        $pageData = $page->toArray();
        $pageData['seo_data'] = SeoMetadata::where('path', $pagePath)->first();

        return response()->json([
            'success' => true,
            'message' => 'Page updated successfully',
            'data' => $pageData
        ]);
    }

    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        $page->delete();

        return response()->json([
            'success' => true,
            'message' => 'Page deleted successfully'
        ]);
    }
}
