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

        if (isset($data['instagram_url']) || isset($data['instagram'])) {
            $instaUrl = $data['instagram_url'] ?? $data['instagram'];
            if ($instaUrl) {
                SocialLink::updateOrCreate(['platform' => 'Instagram'], ['url' => $instaUrl, 'is_active' => true]);
            }
        }

        if (isset($data['facebook_url']) || isset($data['facebook'])) {
            $fbUrl = $data['facebook_url'] ?? $data['facebook'];
            if ($fbUrl) {
                SocialLink::updateOrCreate(['platform' => 'Facebook'], ['url' => $fbUrl, 'is_active' => true]);
            }
        }

        if (isset($data['whatsapp'])) {
            $waVal = $data['whatsapp'];
            if ($waVal) {
                $waUrl = str_starts_with($waVal, 'http') ? $waVal : 'https://wa.me/' . preg_replace('/[^0-9]/', '', $waVal);
                SocialLink::updateOrCreate(['platform' => 'WhatsApp'], ['url' => $waUrl, 'is_active' => true]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => Setting::all()->pluck('value', 'key')
        ]);
    }
}
