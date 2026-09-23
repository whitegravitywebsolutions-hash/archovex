<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminMediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::query();

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where('filename', 'like', "%{$s}%")
                ->orWhere('original_name', 'like', "%{$s}%")
                ->orWhere('alt_text', 'like', "%{$s}%");
        }

        if ($request->has('folder') && $request->folder) {
            $query->where('folder', $request->folder);
        }

        $media = $query->orderBy('created_at', 'desc')->paginate(24);

        return response()->json(['success' => true, 'data' => $media]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,pdf,svg|max:10240',
            'folder' => 'nullable|string',
            'alt_text' => 'nullable|string',
            'title' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $folder = $request->input('folder', 'general');
        $path = $file->store('media/' . $folder, 'public');
        $storageUrl = Storage::url($path);
        $url = str_starts_with($storageUrl, 'http') ? $storageUrl : url($storageUrl);

        $dimensions = @getimagesize($file->getRealPath());
        $width = $dimensions[0] ?? null;
        $height = $dimensions[1] ?? null;

        $media = Media::create([
            'filename' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'path' => $path,
            'url' => $url,
            'alt_text' => $request->input('alt_text', $file->getClientOriginalName()),
            'title' => $request->input('title', $file->getClientOriginalName()),
            'folder' => $folder,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Media uploaded successfully',
            'data' => $media
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $media = Media::findOrFail($id);

        $validated = $request->validate([
            'alt_text' => 'nullable|string',
            'title' => 'nullable|string',
            'caption' => 'nullable|string',
        ]);

        $media->update($validated);

        return response()->json(['success' => true, 'message' => 'Media updated successfully', 'data' => $media]);
    }

    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        Storage::disk('public')->delete($media->path);
        $media->delete();

        return response()->json(['success' => true, 'message' => 'Media deleted successfully']);
    }
}
