<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PublicController;
use App\Http\Controllers\Api\V1\AdminDashboardController;
use App\Http\Controllers\Api\V1\AdminCategoryController;
use App\Http\Controllers\Api\V1\AdminDesignPostController;
use App\Http\Controllers\Api\V1\AdminCityController;
use App\Http\Controllers\Api\V1\AdminServiceController;
use App\Http\Controllers\Api\V1\AdminProjectController;
use App\Http\Controllers\Api\V1\AdminBlogController;
use App\Http\Controllers\Api\V1\AdminMenuController;
use App\Http\Controllers\Api\V1\AdminMediaController;
use App\Http\Controllers\Api\V1\AdminLeadController;
use App\Http\Controllers\Api\V1\AdminSettingController;
use App\Http\Controllers\Api\V1\AdminSeoController;
use App\Http\Controllers\Api\V1\AdminPageController;

/*
|--------------------------------------------------------------------------
| API v1 Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. PUBLIC ROUTES
    Route::get('/home', [PublicController::class, 'home']);
    Route::get('/menus', [PublicController::class, 'menus']);
    Route::get('/categories', [PublicController::class, 'categories']);
    Route::get('/design-categories/{categorySlug}', [PublicController::class, 'categoryBySlug']);
    Route::get('/design-categories/{categorySlug}/{postSlug}', [PublicController::class, 'categoryPostDetail']);
    Route::get('/designs', [PublicController::class, 'designs']);
    Route::get('/designs/{slug}', [PublicController::class, 'designDetail']);
    Route::get('/cities', [PublicController::class, 'cities']);
    Route::get('/cities/{slug}', [PublicController::class, 'cityBySlug']);
    Route::get('/services', [PublicController::class, 'services']);
    Route::get('/services/{slug}', [PublicController::class, 'serviceBySlug']);
    Route::get('/projects', [PublicController::class, 'projects']);
    Route::get('/projects/{slug}', [PublicController::class, 'projectBySlug']);
    Route::get('/blogs', [PublicController::class, 'blogs']);
    Route::get('/blogs/{slug}', [PublicController::class, 'blogBySlug']);
    Route::get('/pages/{slug}', [PublicController::class, 'pageBySlug']);
    Route::get('/settings', [PublicController::class, 'settings']);
    Route::get('/seo', [PublicController::class, 'seoByPath']);
    
    // Leads
    Route::post('/leads', [PublicController::class, 'submitLead']);
    Route::post('/consultation', [PublicController::class, 'submitLead']);

    // 2. ADMIN AUTH ROUTES
    Route::post('/admin/login', [AuthController::class, 'login']);

    // 3. ADMIN PROTECTED ROUTES (SANCTUM)
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [AdminDashboardController::class, 'stats']);

        // Pages & Visual Builder
        Route::apiResource('pages', AdminPageController::class);

        // Categories
        Route::apiResource('categories', AdminCategoryController::class);

        // Design Posts & Multi-Image Upload
        Route::apiResource('design-posts', AdminDesignPostController::class);
        Route::post('/design-posts/{id}/images', [AdminDesignPostController::class, 'uploadImages']);
        Route::post('/design-posts/{id}/images/primary/{imageId}', [AdminDesignPostController::class, 'setPrimaryImage']);
        Route::post('/design-posts/{id}/images/reorder', [AdminDesignPostController::class, 'reorderImages']);
        Route::delete('/design-posts/{id}/images/{imageId}', [AdminDesignPostController::class, 'deleteImage']);

        // Cities, Services, Projects, Blogs
        Route::apiResource('cities', AdminCityController::class);
        Route::apiResource('services', AdminServiceController::class);
        Route::apiResource('projects', AdminProjectController::class);
        Route::apiResource('blogs', AdminBlogController::class);

        // Menus
        Route::get('/menus', [AdminMenuController::class, 'index']);
        Route::post('/menu-items', [AdminMenuController::class, 'storeItem']);
        Route::put('/menu-items/{id}', [AdminMenuController::class, 'updateItem']);
        Route::delete('/menu-items/{id}', [AdminMenuController::class, 'destroyItem']);
        Route::post('/menu-items/reorder', [AdminMenuController::class, 'reorderItems']);

        // Mega Menu Columns & Items
        Route::post('/mega-columns', [AdminMenuController::class, 'storeMegaColumn']);
        Route::put('/mega-columns/{id}', [AdminMenuController::class, 'updateMegaColumn']);
        Route::delete('/mega-columns/{id}', [AdminMenuController::class, 'destroyMegaColumn']);

        Route::post('/mega-items', [AdminMenuController::class, 'storeMegaItem']);
        Route::put('/mega-items/{id}', [AdminMenuController::class, 'updateMegaItem']);
        Route::delete('/mega-items/{id}', [AdminMenuController::class, 'destroyMegaItem']);

        // Media Library
        Route::get('/media', [AdminMediaController::class, 'index']);
        Route::post('/media', [AdminMediaController::class, 'upload']);
        Route::put('/media/{id}', [AdminMediaController::class, 'update']);
        Route::delete('/media/{id}', [AdminMediaController::class, 'destroy']);

        // Leads CRM
        Route::get('/leads', [AdminLeadController::class, 'index']);
        Route::put('/leads/{id}', [AdminLeadController::class, 'updateStatus']);
        Route::delete('/leads/{id}', [AdminLeadController::class, 'destroy']);

        // Settings
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::post('/settings', [AdminSettingController::class, 'update']);

        // SEO
        Route::get('/seo', [AdminSeoController::class, 'index']);
        Route::get('/seo/by-path', [AdminSeoController::class, 'getByPath']);
        Route::post('/seo', [AdminSeoController::class, 'store']);
        Route::put('/seo/{id}', [AdminSeoController::class, 'update']);
        Route::post('/seo-test', [AdminSeoController::class, 'testSeo']);
    });
});
