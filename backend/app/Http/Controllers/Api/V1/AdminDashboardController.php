<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Page;
use App\Models\Lead;
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
                'total_leads' => Lead::count(),
                'new_leads' => Lead::where(function($q) {
                    $q->where('status', 'New')->orWhere('status', 'new')->orWhereNull('status');
                })->count(),
                'recent_leads' => Lead::orderBy('created_at', 'desc')->limit(5)->get(),
                'recent_blogs' => Blog::orderBy('updated_at', 'desc')->limit(5)->get(),
                'recent_pages' => Page::orderBy('updated_at', 'desc')->limit(5)->get(['id', 'title', 'slug', 'status', 'updated_at']),
            ]
        ]);
    }
}
