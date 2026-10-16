<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\City;
use App\Models\DesignPost;
use App\Models\Service;
use App\Models\Project;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\Menu;
use App\Models\Setting;
use App\Models\SocialLink;
use App\Models\Lead;
use App\Models\SeoMetadata;
use App\Models\Page;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home()
    {
        try {
            $featuredDesigns = Blog::where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get();
        } catch (\Throwable $e) {
            $featuredDesigns = collect();
        }

        $projects = collect();
        $testimonials = collect();
        $faqs = collect();

        try {
            $blogs = Blog::with('category')
                ->where('status', 'published')
                ->orderBy('published_at', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
        } catch (\Throwable $e) {
            $blogs = collect();
        }

        $settingsRaw = Setting::all()->pluck('value', 'key');
        $socials = SocialLink::where('is_active', true)->orderBy('sort_order', 'asc')->get();
        $headerMenu = Menu::with([
            'items' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order', 'asc');
            },
            'items.megaColumns' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            },
            'items.megaColumns.items' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order', 'asc');
            }
        ])->where('location', 'header')->first();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => [],
                'featured_designs' => $featuredDesigns,
                'services' => [],
                'projects' => $projects,
                'cities' => [],
                'testimonials' => $testimonials,
                'faqs' => $faqs,
                'blogs' => $blogs,
                'settings' => $settingsRaw,
                'social_links' => $socials,
                'menus' => $headerMenu ? $headerMenu->items : [],
            ]
        ]);
    }

    public function menus()
    {
        $menu = Menu::with([
            'items' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order', 'asc');
            },
            'items.megaColumns' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            },
            'items.megaColumns.items' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order', 'asc');
            }
        ])->where('location', 'header')->first();

        return response()->json([
            'success' => true,
            'data' => $menu ? $menu->items : []
        ]);
    }

    public function categories()
    {
        $categories = Category::where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function categoryBySlug($categorySlug, Request $request)
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();
        $catSeo = SeoMetadata::where('path', '/designs/' . $category->slug)->first();
        $catData = $category->toArray();
        $catData['seo_data'] = $catSeo;

        $query = DesignPost::with(['category', 'city', 'primaryImage', 'images', 'specifications', 'features'])
            ->where('category_id', $category->id)
            ->where('status', 'published');

        if ($request->has('style') && $request->style) {
            $query->where('style', $request->style);
        }
        if ($request->has('layout') && $request->layout) {
            $query->where('layout', $request->layout);
        }
        if ($request->has('city_id') && $request->city_id) {
            $query->where('city_id', $request->city_id);
        }
        if ($request->has('budget_max') && $request->budget_max) {
            $query->where('budget_max', '<=', $request->budget_max);
        }

        $posts = $query->orderBy('sort_order', 'asc')->paginate(12);

        $faqs = Faq::where('category_slug', $categorySlug)->orWhereNull('category_slug')->limit(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $catData,
                'posts' => $posts,
                'faqs' => $faqs,
            ]
        ]);
    }

    public function categoryPostDetail($categorySlug, $postSlug)
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();

        $post = DesignPost::with([
            'category',
            'city',
            'images',
            'features',
            'specifications',
            'relatedPosts.category',
            'relatedPosts.primaryImage'
        ])
            ->where('category_id', $category->id)
            ->where('slug', $postSlug)
            ->where('status', 'published')
            ->firstOrFail();

        // Increment view count
        $post->increment('views');

        $seo = SeoMetadata::where('path', '/designs/' . $post->slug)->first();
        $postData = $post->toArray();
        $postData['seo_data'] = $seo;

        // Fallback related designs if manual related designs empty
        $related = $post->relatedPosts;
        if ($related->isEmpty()) {
            $related = DesignPost::with(['category', 'primaryImage'])
                ->where('category_id', $category->id)
                ->where('id', '!=', $post->id)
                ->where('status', 'published')
                ->limit(4)
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
                'post' => $postData,
                'related' => $related,
            ]
        ]);
    }

    public function designs(Request $request)
    {
        $query = DesignPost::with(['category', 'city', 'primaryImage', 'images'])
            ->where('status', 'published');

        if ($request->has('ids') && $request->ids) {
            $idsList = is_array($request->ids) ? $request->ids : explode(',', $request->ids);
            $query->whereIn('id', array_map('intval', $idsList));
        }

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                    ->orWhere('short_description', 'like', "%{$s}%")
                    ->orWhere('style', 'like', "%{$s}%")
                    ->orWhere('colour', 'like', "%{$s}%")
                    ->orWhere('material', 'like', "%{$s}%");
            });
        }

        if ($request->has('category') && $request->category) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        if ($request->has('style') && $request->style) {
            $query->where('style', $request->style);
        }

        if ($request->has('layout') && $request->layout) {
            $query->where('layout', $request->layout);
        }

        if ($request->has('city') && $request->city) {
            $city = City::where('slug', $request->city)->first();
            if ($city) {
                $query->where('city_id', $city->id);
            }
        }

        $perPage = (int) $request->input('limit', 12);
        if ($perPage > 1000) {
            $perPage = 1000;
        }

        $order = $request->input('order');
        if ($order === 'newest') {
            $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
        } else if ($order === 'oldest') {
            $query->orderBy('created_at', 'asc')->orderBy('id', 'asc');
        } else if ($order === 'title_asc') {
            $query->orderBy('title', 'asc');
        } else if ($order === 'title_desc') {
            $query->orderBy('title', 'desc');
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $posts = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function designDetail($slug)
    {
        $post = DesignPost::with([
            'category',
            'city',
            'images',
            'features',
            'specifications',
            'relatedPosts.category',
            'relatedPosts.primaryImage'
        ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $post->increment('views');

        $related = $post->relatedPosts;
        if ($related->isEmpty()) {
            $related = DesignPost::with(['category', 'primaryImage'])
                ->where('category_id', $post->category_id)
                ->where('id', '!=', $post->id)
                ->where('status', 'published')
                ->limit(4)
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'post' => $post,
                'related' => $related,
            ]
        ]);
    }

    public function cities()
    {
        $cities = City::where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cities
        ]);
    }

    public function cityBySlug($slug)
    {
        $city = City::where('slug', $slug)->first();

        if (!$city) {
            $cityName = ucwords(str_replace('-', ' ', $slug));
            $city = (object)[
                'id' => 0,
                'name' => $cityName,
                'slug' => $slug,
                'state' => 'India',
                'tagline' => "Turnkey Luxury Interior Design Studio in {$cityName}",
                'description' => "ARCHOVEX INFRA offers end-to-end luxury home interiors, modular kitchens, and custom wardrobe solutions in {$cityName}. Enjoy a 10-year warranty, 45-day delivery guarantee, and transparent pricing.",
                'address' => "ARCHOVEX INFRA Experience Studio, Prime Hub, {$cityName}",
                'phone' => '+91 98765 43210',
                'email' => strtolower(str_replace(' ', '', $cityName)) . '@archovex.com',
                'whatsapp' => '919876543210',
                'status' => 'published',
                'meta_title' => "Best Interior Designers in {$cityName} | ARCHOVEX INFRA",
                'meta_description' => "Transform your home with ARCHOVEX INFRA in {$cityName}. Luxury modular kitchens, living rooms, and bedrooms built with German hardware.",
            ];
        }

        $cityId = is_object($city) && isset($city->id) ? $city->id : 0;

        $designs = DesignPost::with(['category', 'primaryImage'])
            ->where('city_id', $cityId)
            ->where('status', 'published')
            ->limit(6)
            ->get();

        if ($designs->count() < 4) {
            $designs = DesignPost::with(['category', 'primaryImage'])
                ->where('status', 'published')
                ->limit(6)
                ->get();
        }

        $services = Service::where('status', 'published')->get();
        $projects = Project::with('images')->where('city_id', $cityId)->get();
        if ($projects->isEmpty()) {
            $projects = Project::with('images')->where('status', 'published')->limit(3)->get();
        }

        $testimonials = Testimonial::where('city_id', $cityId)->get();
        if ($testimonials->isEmpty()) {
            $testimonials = Testimonial::where('status', 'published')->limit(4)->get();
        }

        $faqs = Faq::where('city_id', $cityId)->orWhereNull('city_id')->limit(6)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'city' => $city,
                'designs' => $designs,
                'services' => $services,
                'projects' => $projects,
                'testimonials' => $testimonials,
                'faqs' => $faqs,
            ]
        ]);
    }

    public function services()
    {
        $categories = Category::where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    public function serviceBySlug($slug, Request $request)
    {
        $category = Category::where('slug', $slug)->first();
        if ($category) {
            $catSeo = SeoMetadata::where('path', '/services/' . $category->slug)
                ->orWhere('path', '/designs/' . $category->slug)
                ->first();
            $catData = $category->toArray();
            $catData['seo_data'] = $catSeo;

            $query = DesignPost::with(['category', 'city', 'primaryImage', 'images', 'specifications', 'features'])
                ->where(function ($q) use ($category) {
                    $q->where('category_id', $category->id)
                      ->orWhereJsonContains('category_ids', $category->id);
                })
                ->where('status', 'published');

            if ($request->has('style') && $request->style) {
                $query->where('style', $request->style);
            }
            if ($request->has('layout') && $request->layout) {
                $query->where('layout', $request->layout);
            }
            if ($request->has('city_id') && $request->city_id) {
                $query->where('city_id', $request->city_id);
            }

            $posts = $query->orderBy('sort_order', 'asc')->paginate(12);
            $faqs = Faq::where('category_slug', $slug)->orWhereNull('category_slug')->limit(5)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'category' => $catData,
                    'service' => $catData,
                    'posts' => $posts,
                    'faqs' => $faqs,
                ]
            ]);
        }

        $service = Service::where('slug', $slug)->firstOrFail();
        return response()->json(['success' => true, 'data' => $service]);
    }

    public function projects()
    {
        $projects = Project::with(['city', 'images'])->where('status', 'published')->get();
        return response()->json(['success' => true, 'data' => $projects]);
    }

    public function projectBySlug($slug)
    {
        $project = Project::with(['city', 'images'])->where('slug', $slug)->firstOrFail();
        return response()->json(['success' => true, 'data' => $project]);
    }

    public function blogCategories()
    {
        $categories = BlogCategory::where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function blogs(Request $request)
    {
        $query = Blog::with('category')->where('status', 'published');

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('ids') && $request->ids) {
            $idsList = is_array($request->ids) ? $request->ids : explode(',', $request->ids);
            $query->whereIn('id', array_map('intval', $idsList));
        }

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                    ->orWhere('excerpt', 'like', "%{$s}%")
                    ->orWhere('content', 'like', "%{$s}%");
            });
        }

        $perPage = (int) $request->input('limit', 100);
        if ($perPage > 1000) $perPage = 1000;

        $order = $request->input('order');
        $applyOrder = function ($q) use ($order) {
            if ($order === 'newest') {
                $q->orderBy('published_at', 'desc')->orderBy('created_at', 'desc')->orderBy('id', 'desc');
            } else if ($order === 'oldest') {
                $q->orderBy('published_at', 'asc')->orderBy('created_at', 'asc')->orderBy('id', 'asc');
            } else if ($order === 'title_asc') {
                $q->orderBy('title', 'asc');
            } else if ($order === 'title_desc') {
                $q->orderBy('title', 'desc');
            } else {
                $q->orderBy('published_at', 'desc')->orderBy('id', 'desc');
            }
        };

        $applyOrder($query);
        $posts = $query->paginate($perPage);

        if ($posts->isEmpty() && !$request->has('ids')) {
            $designQuery = DesignPost::with(['category', 'city', 'primaryImage', 'images'])
                ->where('status', 'published');

            if ($request->has('search') && $request->search) {
                $s = $request->search;
                $designQuery->where(function ($q) use ($s) {
                    $q->where('title', 'like', "%{$s}%")
                        ->orWhere('short_description', 'like', "%{$s}%")
                        ->orWhere('description', 'like', "%{$s}%");
                });
            }

            if ($request->has('category_id') && $request->category_id) {
                $designQuery->where('category_id', $request->category_id);
            }

            $applyOrder($designQuery);
            $posts = $designQuery->paginate($perPage);
        }

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function blogBySlug($slug)
    {
        $targetSlug = str_contains($slug, '/') ? last(explode('/', $slug)) : $slug;

        $post = Blog::where('slug', $targetSlug)
            ->where('status', 'published')
            ->first();

        if (!$post && \Illuminate\Support\Facades\Schema::hasTable('design_posts')) {
            $post = DesignPost::with(['primaryImage', 'images'])
                ->where('slug', $targetSlug)
                ->where('status', 'published')
                ->first();
        }

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Blog post not found'], 404);
        }

        $seo = SeoMetadata::where('path', '/blogs/' . $post->slug)
            ->orWhere('path', '/designs/' . $post->slug)
            ->first();
        $postData = is_array($post) ? $post : $post->toArray();
        $postData['seo_data'] = $seo;

        $targetId = is_array($post) ? ($post['id'] ?? 0) : ($post->id ?? 0);
        $related = Blog::with('category')
            ->where('id', '!=', $targetId)
            ->where('status', 'published')
            ->limit(3)
            ->get();

        if ($related->isEmpty() && \Illuminate\Support\Facades\Schema::hasTable('design_posts')) {
            $related = DesignPost::where('id', '!=', $targetId)
                ->where('status', 'published')
                ->limit(4)
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'post' => $postData,
                'related' => $related,
            ]
        ]);
    }

    public function settings()
    {
        $settings = Setting::all()->pluck('value', 'key');
        $socials = SocialLink::where('is_active', true)->orderBy('sort_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'settings' => $settings,
                'social_links' => $socials,
            ]
        ]);
    }

    public function submitLead(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'requirement' => 'nullable|string',
            'message' => 'nullable|string',
            'property_type' => 'nullable|string',
            'budget' => 'nullable|string',
            'city_id' => 'nullable|integer',
            'type' => 'nullable|string',
            'source' => 'nullable|string',
        ]);

        $requirementText = $validated['requirement'] ?? $validated['message'] ?? null;

        $lead = Lead::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'requirement' => $requirementText,
            'message' => $requirementText,
            'property_type' => $validated['property_type'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'city_id' => $validated['city_id'] ?? null,
            'type' => $validated['type'] ?? 'contact',
            'source' => $validated['source'] ?? 'website',
            'status' => 'New',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.',
            'data' => $lead
        ]);
    }

    public function seoByPath(Request $request)
    {
        $path = $request->input('path', '/');
        $seo = SeoMetadata::where('path', $path)->first();

        if (!$seo) {
            $defaultTitle = Setting::getValue('default_meta_title', 'ARCHOVEX INFRA PRIVATE LIMITED');
            $defaultDesc = Setting::getValue('default_meta_description', 'Premium interior design platform');

            return response()->json([
                'success' => true,
                'data' => [
                    'meta_title' => $defaultTitle,
                    'meta_description' => $defaultDesc,
                    'canonical_url' => url($path),
                    'robots' => 'index, follow',
                    'og_title' => $defaultTitle,
                    'og_description' => $defaultDesc,
                    'og_image' => url('/logo.png'),
                ]
            ]);
        }

        return response()->json(['success' => true, 'data' => $seo]);
    }

    public function pageBySlug($slug)
    {
        $targetSlug = ($slug === '/' || $slug === 'home') ? 'home' : $slug;
        $page = Page::with('parent')->where('slug', $targetSlug)->where('status', 'published')->first();

        if (!$page && str_contains($targetSlug, '/')) {
            $parts = explode('/', $targetSlug);
            $childSlug = end($parts);
            $page = Page::with('parent')->where('slug', $childSlug)->where('status', 'published')->first();
        }

        if (!$page) {
            return response()->json(['success' => false, 'message' => 'Page not found'], 404);
        }

        $pagePath = $targetSlug === 'home' ? '/' : '/' . ltrim($targetSlug, '/');
        $seo = SeoMetadata::where('path', $pagePath)->orWhere('path', '/' . $page->slug)->first();
        
        $data = $page->toArray();
        $data['seo_data'] = $seo;

        return response()->json(['success' => true, 'data' => $data]);
    }
}
