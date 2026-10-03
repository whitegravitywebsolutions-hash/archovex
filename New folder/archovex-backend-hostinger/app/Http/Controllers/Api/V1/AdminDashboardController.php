<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\City;
use App\Models\DesignPost;
use App\Models\Lead;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_categories' => Category::count(),
                'total_designs' => DesignPost::count(),
                'published_designs' => DesignPost::where('status', 'published')->count(),
                'draft_designs' => DesignPost::where('status', 'draft')->count(),
                'total_cities' => City::count(),
                'total_projects' => Project::count(),
                'total_services' => Service::count(),
                'total_leads' => Lead::count(),
                'new_leads' => Lead::where('status', 'New')->count(),
                'recent_leads' => Lead::with('city')->orderBy('created_at', 'desc')->limit(5)->get(),
                'recent_designs' => DesignPost::with(['category', 'primaryImage'])->orderBy('updated_at', 'desc')->limit(5)->get(),
            ]
        ]);
    }
}
