<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Service;
use App\Models\MenuItem;

class ServicesCategoriesSeeder extends Seeder
{
    public function run()
    {
        $items = [
            [
                'name' => 'Full Home Interior Design',
                'slug' => 'full-home-interior-design',
                'short_description' => 'Complete 2BHK/3BHK/Villa interior solutions',
                'badge' => 'POPULAR',
                'icon' => 'home',
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 1,
                'price_from' => 650000,
            ],
            [
                'name' => 'Modular Kitchen Design',
                'slug' => 'modular-kitchen-design',
                'short_description' => 'L-shaped, Island & Parallel modular kitchens',
                'badge' => 'MUST HAVE',
                'icon' => 'utensils',
                'image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 2,
                'price_from' => 180000,
            ],
            [
                'name' => 'Living Room Interior Design',
                'slug' => 'living-room-interior-design',
                'short_description' => 'TV console units, foyers & lounge spaces',
                'badge' => null,
                'icon' => 'sofa',
                'image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 3,
                'price_from' => 220000,
            ],
            [
                'name' => 'Bedroom Interior Design',
                'slug' => 'bedroom-interior-design',
                'short_description' => 'Master bedrooms, kids rooms & guest suites',
                'badge' => null,
                'icon' => 'bed',
                'image' => 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 4,
                'price_from' => 250000,
            ],
            [
                'name' => 'Wardrobe Design',
                'slug' => 'wardrobe-design',
                'short_description' => 'Sliding glass, walk-in & hinged wardrobes',
                'badge' => 'TRENDING',
                'icon' => 'door',
                'image' => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 5,
                'price_from' => 150000,
            ],
            [
                'name' => 'Home Renovation & Remodeling',
                'slug' => 'home-renovation',
                'short_description' => 'Civil changes, flooring, painting & upgrades',
                'badge' => null,
                'icon' => 'hammer',
                'image' => 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 6,
                'price_from' => 300000,
            ],
            [
                'name' => 'Office Interior Design',
                'slug' => 'office-interior-design',
                'short_description' => 'Modern workspaces & private cabins',
                'badge' => null,
                'icon' => 'briefcase',
                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 7,
                'price_from' => 450000,
            ],
            [
                'name' => 'Corporate Office Interior Design',
                'slug' => 'corporate-office-interior-design',
                'short_description' => 'Turnkey IT parks & corporate floors',
                'badge' => null,
                'icon' => 'building-2',
                'image' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 8,
                'price_from' => 1200000,
            ],
            [
                'name' => 'Commercial Interior Design',
                'slug' => 'commercial-interior-design',
                'short_description' => 'Retail stores, showrooms & cafes',
                'badge' => null,
                'icon' => 'store',
                'image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 9,
                'price_from' => 850000,
            ],
            [
                'name' => 'Turnkey Interior Design',
                'slug' => 'turnkey-interior-design',
                'short_description' => 'End-to-end design to handover execution',
                'badge' => 'ALL-IN-ONE',
                'icon' => 'key',
                'image' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 10,
                'price_from' => 950000,
            ],
        ];

        $validSlugs = collect($items)->pluck('slug')->toArray();

        // Delete previous categories and services not in active 10 list
        Category::whereNotIn('slug', $validSlugs)->delete();
        Service::whereNotIn('slug', $validSlugs)->delete();

        foreach ($items as $item) {
            Category::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'short_description' => $item['short_description'],
                    'description' => "Turnkey {$item['name']} by ARCHOVEX INFRA PRIVATE LIMITED.",
                    'image' => $item['image'],
                    'icon' => $item['icon'],
                    'status' => 'published',
                    'is_featured' => true,
                    'sort_order' => $item['sort_order'],
                    'meta_title' => "{$item['name']} | ARCHOVEX INFRA",
                    'meta_description' => $item['short_description'],
                ]
            );

            Service::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['name'],
                    'short_description' => $item['short_description'],
                    'description' => "Complete {$item['name']} with 10-year warranty & German hardware.",
                    'image' => $item['image'],
                    'icon' => $item['icon'],
                    'price_from' => $item['price_from'],
                    'is_featured' => true,
                    'status' => 'published',
                    'meta_title' => "{$item['name']} | ARCHOVEX INFRA",
                    'meta_description' => $item['short_description'],
                ]
            );
        }

        MenuItem::updateOrCreate(
            ['menu_id' => 1, 'sort_order' => 2],
            [
                'label' => 'Services',
                'url' => '/services',
                'type' => 'servicesmenu',
                'is_active' => true,
            ]
        );
    }
}
