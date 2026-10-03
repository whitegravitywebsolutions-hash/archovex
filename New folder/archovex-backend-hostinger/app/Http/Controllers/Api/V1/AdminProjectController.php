<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['city', 'images'])->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $projects]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug',
            'client_name' => 'nullable|string',
            'city_id' => 'nullable|exists:cities,id',
            'property_type' => 'nullable|string',
            'area' => 'nullable|string',
            'budget' => 'nullable|string',
            'duration' => 'nullable|string',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'status' => 'required|string',
            'is_featured' => 'boolean',
            'images' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $project = Project::create($validated);

        if (!empty($validated['images'])) {
            foreach ($validated['images'] as $idx => $img) {
                $url = is_array($img) ? ($img['image'] ?? '') : $img;
                if (!empty($url)) {
                    ProjectImage::create([
                        'project_id' => $project->id,
                        'image' => $url,
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Project created successfully', 'data' => $project->load('images')], 201);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'data' => Project::with(['city', 'images'])->findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug,' . $id,
            'client_name' => 'nullable|string',
            'city_id' => 'nullable|exists:cities,id',
            'property_type' => 'nullable|string',
            'area' => 'nullable|string',
            'budget' => 'nullable|string',
            'duration' => 'nullable|string',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'status' => 'required|string',
            'is_featured' => 'boolean',
            'images' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $project->update($validated);

        if (isset($validated['images'])) {
            $project->images()->delete();
            foreach ($validated['images'] as $idx => $img) {
                $url = is_array($img) ? ($img['image'] ?? '') : $img;
                if (!empty($url)) {
                    ProjectImage::create([
                        'project_id' => $project->id,
                        'image' => $url,
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Project updated successfully', 'data' => $project->load('images')]);
    }

    public function destroy($id)
    {
        Project::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Project deleted successfully']);
    }
}
