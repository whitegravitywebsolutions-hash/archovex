<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return response()->json(['success' => true, 'data' => $services]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:services,slug',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'icon' => 'nullable|string',
            'price_from' => 'nullable|numeric',
            'is_featured' => 'boolean',
            'status' => 'required|string',
            'city_id' => 'nullable|exists:cities,id',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $service = Service::create($validated);

        return response()->json(['success' => true, 'message' => 'Service created successfully', 'data' => $service], 201);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'data' => Service::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:services,slug,' . $id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'icon' => 'nullable|string',
            'price_from' => 'nullable|numeric',
            'is_featured' => 'boolean',
            'status' => 'required|string',
            'city_id' => 'nullable|exists:cities,id',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $service->update($validated);

        return response()->json(['success' => true, 'message' => 'Service updated successfully', 'data' => $service]);
    }

    public function destroy($id)
    {
        Service::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Service deleted successfully']);
    }
}
