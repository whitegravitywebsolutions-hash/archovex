<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DesignPost;
use App\Models\DesignPostImage;
use App\Models\DesignPostFeature;
use App\Models\DesignPostSpecification;
use App\Models\SeoMetadata;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminDesignPostController extends Controller
{
    public function index(Request $request)
    {
        $query = DesignPost::with(['category', 'city', 'primaryImage', 'images']);

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                    ->orWhere('short_description', 'like', "%{$s}%")
                    ->orWhere('style', 'like', "%{$s}%");
            });
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('city_id') && $request->city_id) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $posts = $query->orderBy('updated_at', 'desc')->paginate(15);

        return response()->json(['success' => true, 'data' => $posts]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:design_posts,slug',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'style' => 'nullable|string',
            'room_type' => 'nullable|string',
            'layout' => 'nullable|string',
            'dimensions' => 'nullable|string',
            'colour' => 'nullable|string',
            'material' => 'nullable|string',
            'finish' => 'nullable|string',
            'budget_min' => 'nullable|numeric',
            'budget_max' => 'nullable|numeric',
            'property_type' => 'nullable|string',
            'area' => 'nullable|string',
            'city_id' => 'nullable|exists:cities,id',
            'location' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|string|in:published,draft,archived',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'twitter_title' => 'nullable|string',
            'twitter_description' => 'nullable|string',
            'twitter_image' => 'nullable|string',
            'robots' => 'nullable|string',
            'images' => 'nullable|array',
            'specifications' => 'nullable|array',
            'features' => 'nullable|array',
            'related_ids' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $post = DesignPost::create($validated);

        // Process specifications
        if (!empty($validated['specifications'])) {
            foreach ($validated['specifications'] as $idx => $spec) {
                if (!empty($spec['label']) && !empty($spec['value'])) {
                    DesignPostSpecification::create([
                        'design_post_id' => $post->id,
                        'label' => $spec['label'],
                        'value' => $spec['value'],
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
        }

        // Process features
        if (!empty($validated['features'])) {
            foreach ($validated['features'] as $idx => $ft) {
                if (!empty($ft)) {
                    DesignPostFeature::create([
                        'design_post_id' => $post->id,
                        'feature' => is_array($ft) ? ($ft['feature'] ?? '') : $ft,
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
        }

        // Process images if array of URLs passed
        if (!empty($validated['images'])) {
            foreach ($validated['images'] as $idx => $img) {
                $url = is_array($img) ? ($img['image'] ?? '') : $img;
                if (!empty($url)) {
                    DesignPostImage::create([
                        'design_post_id' => $post->id,
                        'image' => $url,
                        'alt_text' => $post->title . ' Image ' . ($idx + 1),
                        'sort_order' => $idx + 1,
                        'is_primary' => ($idx === 0),
                        'is_mobile' => ($idx === 0),
                    ]);
                }
            }
        }

        if (!empty($validated['related_ids'])) {
            $post->relatedPosts()->sync($validated['related_ids']);
        }

        // Sync 15 Strapi-style SEO fields to seo_metadata table
        if (!empty($post->slug)) {
            $seoInput = $request->input('seo_data', []);
            SeoMetadata::updateOrCreate(
                ['path' => '/designs/' . $post->slug],
                [
                    'meta_title' => $seoInput['meta_title'] ?? $validated['meta_title'] ?? $post->title,
                    'meta_description' => $seoInput['meta_description'] ?? $validated['meta_description'] ?? $post->short_description,
                    'focus_keyphrase' => $seoInput['focus_keyphrase'] ?? null,
                    'canonical_url' => $seoInput['canonical_url'] ?? null,
                    'robots_index' => isset($seoInput['robots_index']) ? (bool)$seoInput['robots_index'] : true,
                    'robots_follow' => isset($seoInput['robots_follow']) ? (bool)$seoInput['robots_follow'] : true,
                    'og_title' => $seoInput['og_title'] ?? null,
                    'og_description' => $seoInput['og_description'] ?? null,
                    'og_url' => $seoInput['og_url'] ?? null,
                    'og_type' => $seoInput['og_type'] ?? 'article',
                    'og_site_name' => $seoInput['og_site_name'] ?? null,
                    'og_image' => $seoInput['og_image'] ?? $post->featured_image,
                    'twitter_card' => $seoInput['twitter_card'] ?? 'summary_large_image',
                    'twitter_site' => $seoInput['twitter_site'] ?? null,
                    'schema_code' => $seoInput['schema_code'] ?? null,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Design post created successfully',
            'data' => array_merge($post->load(['category', 'city', 'images', 'specifications', 'features', 'relatedPosts'])->toArray(), [
                'seo_data' => SeoMetadata::where('path', '/designs/' . $post->slug)->first()
            ])
        ], 201);
    }

    public function show($id)
    {
        $post = DesignPost::with(['category', 'city', 'images', 'specifications', 'features', 'relatedPosts'])->findOrFail($id);
        $seo = SeoMetadata::where('path', '/designs/' . $post->slug)->first();
        $postData = $post->toArray();
        $postData['seo_data'] = $seo;

        return response()->json(['success' => true, 'data' => $postData]);
    }

    public function update(Request $request, $id)
    {
        $post = DesignPost::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:design_posts,slug,' . $id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'style' => 'nullable|string',
            'room_type' => 'nullable|string',
            'layout' => 'nullable|string',
            'dimensions' => 'nullable|string',
            'colour' => 'nullable|string',
            'material' => 'nullable|string',
            'finish' => 'nullable|string',
            'budget_min' => 'nullable|numeric',
            'budget_max' => 'nullable|numeric',
            'property_type' => 'nullable|string',
            'area' => 'nullable|string',
            'city_id' => 'nullable|exists:cities,id',
            'location' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|string|in:published,draft,archived',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'twitter_title' => 'nullable|string',
            'twitter_description' => 'nullable|string',
            'twitter_image' => 'nullable|string',
            'robots' => 'nullable|string',
            'images' => 'nullable|array',
            'specifications' => 'nullable|array',
            'features' => 'nullable|array',
            'related_ids' => 'nullable|array',
            'seo_data' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $post->update($validated);

        // Sync Specs
        if (isset($validated['specifications'])) {
            $post->specifications()->delete();
            foreach ($validated['specifications'] as $idx => $spec) {
                if (!empty($spec['label']) && !empty($spec['value'])) {
                    DesignPostSpecification::create([
                        'design_post_id' => $post->id,
                        'label' => $spec['label'],
                        'value' => $spec['value'],
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
        }

        // Sync Features
        if (isset($validated['features'])) {
            $post->features()->delete();
            foreach ($validated['features'] as $idx => $ft) {
                $val = is_array($ft) ? ($ft['feature'] ?? '') : $ft;
                if (!empty($val)) {
                    DesignPostFeature::create([
                        'design_post_id' => $post->id,
                        'feature' => $val,
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
        }

        if (isset($validated['related_ids'])) {
            $post->relatedPosts()->sync($validated['related_ids']);
        }

        // Sync 15 Strapi-style SEO fields to seo_metadata table
        if (!empty($post->slug)) {
            $seoInput = $request->input('seo_data', []);
            SeoMetadata::updateOrCreate(
                ['path' => '/designs/' . $post->slug],
                [
                    'meta_title' => $seoInput['meta_title'] ?? $validated['meta_title'] ?? $post->title,
                    'meta_description' => $seoInput['meta_description'] ?? $validated['meta_description'] ?? $post->short_description,
                    'focus_keyphrase' => $seoInput['focus_keyphrase'] ?? null,
                    'canonical_url' => $seoInput['canonical_url'] ?? null,
                    'robots_index' => isset($seoInput['robots_index']) ? (bool)$seoInput['robots_index'] : true,
                    'robots_follow' => isset($seoInput['robots_follow']) ? (bool)$seoInput['robots_follow'] : true,
                    'og_title' => $seoInput['og_title'] ?? null,
                    'og_description' => $seoInput['og_description'] ?? null,
                    'og_url' => $seoInput['og_url'] ?? null,
                    'og_type' => $seoInput['og_type'] ?? 'article',
                    'og_site_name' => $seoInput['og_site_name'] ?? null,
                    'og_image' => $seoInput['og_image'] ?? $post->featured_image,
                    'twitter_card' => $seoInput['twitter_card'] ?? 'summary_large_image',
                    'twitter_site' => $seoInput['twitter_site'] ?? null,
                    'schema_code' => $seoInput['schema_code'] ?? null,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Design post updated successfully',
            'data' => array_merge($post->load(['category', 'city', 'images', 'specifications', 'features', 'relatedPosts'])->toArray(), [
                'seo_data' => SeoMetadata::where('path', '/designs/' . $post->slug)->first()
            ])
        ]);
    }

    public function destroy($id)
    {
        $post = DesignPost::findOrFail($id);
        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Design post deleted successfully'
        ]);
    }

    // MULTI-IMAGE MANAGEMENT API
    public function uploadImages(Request $request, $id)
    {
        $post = DesignPost::findOrFail($id);

        $request->validate([
            'file' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:10240',
            'url' => 'nullable|string',
        ]);

        $url = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('designs', 'public');
            $storageUrl = Storage::url($path);
            $url = str_starts_with($storageUrl, 'http') ? $storageUrl : url($storageUrl);
        } else if ($request->filled('url')) {
            $url = $request->input('url');
        }

        if (!$url) {
            return response()->json(['success' => false, 'message' => 'No image file or URL provided'], 422);
        }

        $count = $post->images()->count();
        $img = DesignPostImage::create([
            'design_post_id' => $post->id,
            'image' => $url,
            'alt_text' => $post->title,
            'sort_order' => $count + 1,
            'is_primary' => ($count === 0),
            'is_mobile' => ($count === 0),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'data' => $img
        ]);
    }

    public function setPrimaryImage($id, $imageId)
    {
        $post = DesignPost::findOrFail($id);

        // Reset all primary flags
        $post->images()->update(['is_primary' => false]);

        $img = DesignPostImage::where('design_post_id', $post->id)->where('id', $imageId)->firstOrFail();
        $img->update(['is_primary' => true]);

        // Also update featured_image on post
        $post->update(['featured_image' => $img->image]);

        return response()->json([
            'success' => true,
            'message' => 'Primary image updated successfully'
        ]);
    }

    public function reorderImages(Request $request, $id)
    {
        $post = DesignPost::findOrFail($id);

        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:design_post_images,id',
        ]);

        foreach ($request->order as $idx => $imageId) {
            DesignPostImage::where('design_post_id', $post->id)
                ->where('id', $imageId)
                ->update(['sort_order' => $idx + 1]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Images reordered successfully'
        ]);
    }

    public function deleteImage($id, $imageId)
    {
        $img = DesignPostImage::where('design_post_id', $id)->where('id', $imageId)->firstOrFail();
        $img->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully'
        ]);
    }
}
