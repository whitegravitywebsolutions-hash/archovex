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

    public function base64($id)
    {
        $media = Media::findOrFail($id);

        if (!Storage::disk('public')->exists($media->path)) {
            return response()->json(['success' => false, 'message' => 'File not found'], 404);
        }

        $fileContent = Storage::disk('public')->get($media->path);
        $mime = $media->mime_type ?? 'image/jpeg';
        $base64 = 'data:' . $mime . ';base64,' . base64_encode($fileContent);

        return response()->json([
            'success' => true,
            'data_url' => $base64
        ]);
    }

    public function crop(Request $request, $id)
    {
        $media = Media::findOrFail($id);

        $file = null;
        $tempPath = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
        } elseif ($request->input('image_data')) {
            $base64Data = $request->input('image_data');
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
                $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                $ext = strtolower($type[1]);
                if ($ext === 'jpeg') $ext = 'jpg';
                $base64Data = base64_decode($base64Data);

                if ($base64Data !== false) {
                    $tempPath = sys_get_temp_dir() . '/' . uniqid('crop_') . '.' . $ext;
                    file_put_contents($tempPath, $base64Data);
                    $file = new \Illuminate\Http\UploadedFile($tempPath, 'cropped_' . ($media->filename ?? 'image.jpg'), 'image/' . $ext, null, true);
                }
            }
        }

        if (!$file) {
            return response()->json(['success' => false, 'message' => 'The file field is required.'], 422);
        }

        // Safely delete old file if exists
        try {
            if ($media->path && Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }
        } catch (\Exception $e) {
            // Ignore lock error on Windows OS
        }

        $folder = $media->folder ?? 'general';
        $path = $file->store('media/' . $folder, 'public');
        $storageUrl = Storage::url($path);
        $url = str_starts_with($storageUrl, 'http') ? $storageUrl : url($storageUrl);

        $dimensions = @getimagesize($file->getRealPath());
        $width = $dimensions[0] ?? null;
        $height = $dimensions[1] ?? null;

        $media->update([
            'filename' => basename($path),
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'path' => $path,
            'url' => $url,
            'alt_text' => $request->input('alt_text', $media->alt_text),
            'title' => $request->input('title', $media->title),
            'caption' => $request->input('caption', $media->caption),
        ]);

        if ($tempPath && file_exists($tempPath)) {
            @unlink($tempPath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Image cropped and updated successfully',
            'data' => $media
        ]);
    }


    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        if ($media->path && Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }
        $media->delete();

        return response()->json(['success' => true, 'message' => 'Media deleted successfully']);
    }
}

