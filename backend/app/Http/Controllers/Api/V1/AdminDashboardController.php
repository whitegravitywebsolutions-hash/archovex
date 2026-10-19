<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Page;
use App\Models\Media;
use App\Models\Menu;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_blogs' => Blog::count(),
                'published_blogs' => Blog::where('status', 'published')->count(),
                'draft_blogs' => Blog::where('status', 'draft')->count(),
                'total_pages' => Page::count(),
                'published_pages' => Page::where('status', 'published')->count(),
                'total_media' => Media::count(),
                'total_menus' => Menu::count(),
                'recent_blogs' => Blog::orderBy('updated_at', 'desc')->limit(5)->get(),
                'recent_pages' => Page::orderBy('updated_at', 'desc')->limit(5)->get(['id', 'title', 'slug', 'status', 'updated_at']),
            ]
        ]);
    }
}
