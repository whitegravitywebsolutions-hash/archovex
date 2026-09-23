<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use Illuminate\Http\Request;

class AdminSeoController extends Controller
{
    public function index()
    {
        $seo = SeoMetadata::orderBy('path', 'asc')->get();
        return response()->json(['success' => true, 'data' => $seo]);
    }

    public function getByPath(Request $request)
    {
        $path = $request->query('path', '/');
        $seo = SeoMetadata::where('path', $path)->first();
        return response()->json(['success' => true, 'data' => $seo]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'path' => 'required|string',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'focus_keyphrase' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_url' => 'nullable|string',
            'og_type' => 'nullable|string',
            'og_site_name' => 'nullable|string',
            'og_image' => 'nullable|string',
            'twitter_card' => 'nullable|string',
            'twitter_site' => 'nullable|string',
            'schema_code' => 'nullable|string',
            'robots' => 'nullable|string',
        ]);

        $seo = SeoMetadata::updateOrCreate(['path' => $validated['path']], $validated);

        return response()->json(['success' => true, 'message' => 'SEO metadata saved', 'data' => $seo], 200);
    }

    public function update(Request $request, $id)
    {
        $seo = SeoMetadata::findOrFail($id);

        $validated = $request->validate([
            'path' => 'required|string|unique:seo_metadata,path,' . $id,
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'focus_keyphrase' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_url' => 'nullable|string',
            'og_type' => 'nullable|string',
            'og_site_name' => 'nullable|string',
            'og_image' => 'nullable|string',
            'twitter_card' => 'nullable|string',
            'twitter_site' => 'nullable|string',
            'schema_code' => 'nullable|string',
            'robots' => 'nullable|string',
        ]);

        $seo->update($validated);

        return response()->json(['success' => true, 'message' => 'SEO metadata updated', 'data' => $seo]);
    }

    public function testSeo(Request $request)
    {
        $request->validate(['path' => 'required|string']);

        $path = $request->input('path');
        $seo = SeoMetadata::where('path', $path)->first();

        $metaTitle = $seo ? $seo->meta_title : 'Default Title';
        $metaDesc = $seo ? $seo->meta_description : 'Default Description';
        $canonical = $seo ? $seo->canonical_url : url($path);
        $robots = $seo ? $seo->robots : 'index, follow';

        return response()->json([
            'success' => true,
            'data' => [
                'path' => $path,
                'status' => 200,
                'indexable' => str_contains($robots, 'index'),
                'meta_title' => $metaTitle,
                'meta_title_length' => strlen($metaTitle ?? ''),
                'meta_title_status' => (strlen($metaTitle ?? '') >= 30 && strlen($metaTitle ?? '') <= 60) ? 'GOOD' : 'WARN',
                'meta_description' => $metaDesc,
                'meta_description_length' => strlen($metaDesc ?? ''),
                'meta_description_status' => (strlen($metaDesc ?? '') >= 120 && strlen($metaDesc ?? '') <= 160) ? 'GOOD' : 'WARN',
                'canonical' => $canonical,
                'robots' => $robots,
                'og_title' => $seo ? $seo->og_title : $metaTitle,
                'og_description' => $seo ? $seo->og_description : $metaDesc,
                'og_image' => $seo ? $seo->og_image : url('/logo.png'),
                'json_ld_present' => true,
            ]
        ]);
    }
}
