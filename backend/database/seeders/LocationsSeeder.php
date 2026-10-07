<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;

class LocationsSeeder extends Seeder
{
    public function run()
    {
        $locations = [
            [
                'name' => 'Noida',
                'slug' => 'noida',
                'state' => 'Uttar Pradesh',
                'description' => 'Premier luxury home interior design, modular kitchen & wardrobe studio in Noida.',
                'address' => 'ARCHOVEX Experience Center, Sector 62, Noida, UP 201309',
                'phone' => '+91 98765 43210',
                'whatsapp' => '+919876543210',
                'status' => 'published',
                'sort_order' => 1,
            ],
            [
                'name' => 'Greater Noida',
                'slug' => 'greater-noida',
                'state' => 'Uttar Pradesh',
                'description' => 'Turnkey villa & apartment interior execution team in Greater Noida West.',
                'address' => 'ARCHOVEX Studio, Pari Chowk, Greater Noida, UP 201310',
                'phone' => '+91 98765 43210',
                'whatsapp' => '+919876543210',
                'status' => 'published',
                'sort_order' => 2,
            ],
            [
                'name' => 'Delhi',
                'slug' => 'delhi',
                'state' => 'Delhi NCR',
                'description' => 'Luxury interior design and architectural planning studio in Delhi.',
                'address' => 'ARCHOVEX Experience Center, South Extension, New Delhi 110049',
                'phone' => '+91 98765 43210',
                'whatsapp' => '+919876543210',
                'status' => 'published',
                'sort_order' => 3,
            ],
            [
                'name' => 'New Delhi',
                'slug' => 'new-delhi',
                'state' => 'Delhi NCR',
                'description' => 'High-end bungalow & penthouse interior design experience center in New Delhi.',
                'address' => 'ARCHOVEX Corporate HQ, Connaught Place, New Delhi 110001',
                'phone' => '+91 98765 43210',
                'whatsapp' => '+919876543210',
                'status' => 'published',
                'sort_order' => 4,
            ],
            [
                'name' => 'Gurgaon',
                'slug' => 'gurgaon',
                'state' => 'Haryana',
                'description' => 'Modern luxury interior architects & modular woodworking factory studio in Gurgaon (Gurugram).',
                'address' => 'ARCHOVEX Studio, Golf Course Road, Sector 54, Gurugram, HR 122002',
                'phone' => '+91 98765 43210',
                'whatsapp' => '+919876543210',
                'status' => 'published',
                'sort_order' => 5,
            ],
        ];

        foreach ($locations as $loc) {
            City::updateOrCreate(
                ['slug' => $loc['slug']],
                $loc
            );
        }
    }
}
