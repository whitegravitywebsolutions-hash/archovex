<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCityController extends Controller
{
    public function index(Request $request)
    {
        $cities = City::orderBy('sort_order', 'asc')->get();
        return response()->json(['success' => true, 'data' => $cities]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:cities,slug',
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'description' => 'nullable|string',
            'hero_image' => 'nullable|string',
            'mobile_image' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'whatsapp' => 'nullable|string',
            'status' => 'required|string|in:published,draft,archived',
            'sort_order' => 'integer',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'robots' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $city = City::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'City created successfully',
            'data' => $city
        ], 201);
    }

    public function show($id)
    {
        $city = City::findOrFail($id);
        return response()->json(['success' => true, 'data' => $city]);
    }

    public function update(Request $request, $id)
    {
        $city = City::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:cities,slug,' . $id,
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'description' => 'nullable|string',
            'hero_image' => 'nullable|string',
            'mobile_image' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'whatsapp' => 'nullable|string',
            'status' => 'required|string|in:published,draft,archived',
            'sort_order' => 'integer',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'og_title' => 'nullable|string',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'robots' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $city->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'City updated successfully',
            'data' => $city
        ]);
    }

    public function destroy($id)
    {
        $city = City::findOrFail($id);
        $city->delete();

        return response()->json([
            'success' => true,
            'message' => 'City deleted successfully'
        ]);
    }
}
