<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::query();

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                    ->orWhere('excerpt', 'like', "%{$s}%")
                    ->orWhere('content', 'like', "%{$s}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('is_featured') && $request->is_featured !== null && $request->is_featured !== '') {
            $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = (int) $request->input('limit', 25);
        $blogs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json(['success' => true, 'data' => $blogs]);
    }

    public function toggleFeatured($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->is_featured = !$blog->is_featured;
        $blog->save();

        return response()->json([
            'success' => true,
            'message' => 'Featured status updated',
            'is_featured' => $blog->is_featured
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'short_description' => 'nullable|string',
            'content' => 'nullable|string',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'author' => 'nullable|string',
            'status' => 'required|string',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $validated['excerpt'] = $validated['short_description'] ?? $validated['excerpt'] ?? '';
        $validated['content'] = $validated['description'] ?? $validated['content'] ?? '';

        $blog = Blog::create($validated);

        return response()->json(['success' => true, 'message' => 'Blog post created successfully', 'data' => $blog], 201);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'data' => Blog::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'short_description' => 'nullable|string',
            'content' => 'nullable|string',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'author' => 'nullable|string',
            'status' => 'required|string',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['short_description'])) {
            $validated['excerpt'] = $validated['short_description'];
        }
        if (isset($validated['description'])) {
            $validated['content'] = $validated['description'];
        }

        $blog->update($validated);

        return response()->json(['success' => true, 'message' => 'Blog post updated successfully', 'data' => $blog]);
    }

    public function destroy($id)
    {
        Blog::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Blog post deleted successfully']);
    }

    public function clone($id)
    {
        $original = Blog::findOrFail($id);

        $newTitle = $original->title . ' (Copy)';
        $baseSlug = Str::slug($newTitle);
        $newSlug = $baseSlug;
        $count = 1;
        while (Blog::where('slug', $newSlug)->exists()) {
            $newSlug = $baseSlug . '-' . $count;
            $count++;
        }

        $cloned = Blog::create([
            'title' => $newTitle,
            'slug' => $newSlug,
            'excerpt' => $original->excerpt,
            'short_description' => $original->short_description ?? $original->excerpt,
            'content' => $original->content,
            'description' => $original->description ?? $original->content,
            'featured_image' => $original->featured_image,
            'author' => $original->author,
            'status' => 'draft',
            'is_featured' => false,
            'published_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Blog post cloned as draft successfully',
            'data' => $cloned
        ], 201);
    }
}
