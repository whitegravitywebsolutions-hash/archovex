<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('category')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $blogs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'author' => 'nullable|string',
            'category_id' => 'nullable|exists:blog_categories,id',
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

        $blog = Blog::create($validated);

        return response()->json(['success' => true, 'message' => 'Blog post created successfully', 'data' => $blog], 201);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'data' => Blog::with(['category', 'tags'])->findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $id,
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'author' => 'nullable|string',
            'category_id' => 'nullable|exists:blog_categories,id',
            'status' => 'required|string',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $blog->update($validated);

        return response()->json(['success' => true, 'message' => 'Blog post updated successfully', 'data' => $blog]);
    }

    public function destroy($id)
    {
        Blog::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Blog post deleted successfully']);
    }
}
