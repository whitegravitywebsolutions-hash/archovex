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
        $query = Page::with('parent');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('slug', 'like', "%{$s}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('parent_id')) {
            if ($request->parent_id === 'null' || $request->parent_id === 'top') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $request->parent_id);
            }
        }

        $sortBy = $request->input('sort_by', 'updated_at');
        $allowedSorts = ['title', 'slug', 'status', 'created_at', 'updated_at', 'id'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'updated_at';
        }

        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortBy, $sortDir);

        if ($request->has('per_page') && $request->per_page === 'all') {
            $pages = $query->get();
            return response()->json([
                'success' => true,
                'data' => $pages,
                'pagination' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $pages->count(),
                    'total' => $pages->count(),
                ]
            ]);
        }

        $perPage = (int) $request->input('per_page', 10);
        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $paginated->items(),
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:pages,id',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'status' => 'required|string|in:published,draft',
            'published_at' => 'nullable|date',
            'sections' => 'nullable|array',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'seo_data' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page = Page::create($validated);
        $page->load('parent');

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
        $page = Page::with('parent')->findOrFail($id);
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
            'parent_id' => 'nullable|exists:pages,id',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $id,
            'status' => 'required|string|in:published,draft',
            'published_at' => 'nullable|date',
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

    public function clone($id)
    {
        $original = Page::findOrFail($id);

        $newTitle = $original->title . ' (Copy)';
        $baseSlug = Str::slug($newTitle);
        $newSlug = $baseSlug;
        $count = 1;
        while (Page::where('slug', $newSlug)->exists()) {
            $newSlug = $baseSlug . '-' . $count;
            $count++;
        }

        $clonedSections = is_array($original->sections) ? array_map(function ($sec) {
            $sec['id'] = 'sec_' . time() . '_' . Str::random(4);
            return $sec;
        }, $original->sections) : [];

        $cloned = Page::create([
            'title' => $newTitle,
            'slug' => $newSlug,
            'parent_id' => $original->parent_id,
            'status' => 'draft',
            'published_at' => null,
            'sections' => $clonedSections,
            'meta_title' => $original->meta_title ? $original->meta_title . ' (Copy)' : null,
            'meta_description' => $original->meta_description,
        ]);

        $origPath = $original->slug === 'home' ? '/' : '/' . ltrim($original->slug, '/');
        $origSeo = SeoMetadata::where('path', $origPath)->first();
        if ($origSeo) {
            $newPath = '/' . ltrim($newSlug, '/');
            $seoArr = $origSeo->toArray();
            unset($seoArr['id'], $seoArr['created_at'], $seoArr['updated_at']);
            $seoArr['path'] = $newPath;
            $seoArr['meta_title'] = ($seoArr['meta_title'] ?? $original->title) . ' (Copy)';
            SeoMetadata::create($seoArr);
        }

        $cloned->load('parent');
        $clonedData = $cloned->toArray();
        $clonedData['seo_data'] = SeoMetadata::where('path', '/' . ltrim($newSlug, '/'))->first();

        return response()->json([
            'success' => true,
            'message' => 'Page cloned as draft successfully',
            'data' => $clonedData
        ], 201);
    }
}
