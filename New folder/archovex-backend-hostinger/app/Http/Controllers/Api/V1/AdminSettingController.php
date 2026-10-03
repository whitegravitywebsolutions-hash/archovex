<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        $socials = SocialLink::orderBy('sort_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'settings' => $settings,
                'social_links' => $socials,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->except(['_token', 'social_links']);

        foreach ($data as $key => $val) {
            Setting::setValue($key, is_array($val) ? json_encode($val) : $val);
        }

        if ($request->has('social_links')) {
            foreach ($request->social_links as $idx => $soc) {
                if (!empty($soc['platform']) && !empty($soc['url'])) {
                    SocialLink::updateOrCreate(
                        ['platform' => $soc['platform']],
                        [
                            'url' => $soc['url'],
                            'icon' => $soc['icon'] ?? null,
                            'sort_order' => $idx + 1,
                            'is_active' => $soc['is_active'] ?? true,
                        ]
                    );
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => Setting::all()->pluck('value', 'key')
        ]);
    }
}
