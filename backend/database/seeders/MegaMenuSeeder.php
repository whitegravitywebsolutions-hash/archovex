<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;
use App\Models\MegaMenuColumn;
use App\Models\MegaMenuItem;

class MegaMenuSeeder extends Seeder
{
    public function run()
    {
        $servicesItem = MenuItem::where('url', '/services')->orWhere('label', 'like', '%Service%')->first();
        if (!$servicesItem) {
            $servicesItem = MenuItem::create([
                'menu_id' => 1,
                'label' => 'Services',
                'url' => '/services',
                'type' => 'megamenu',
                'sort_order' => 2,
                'is_active' => true,
            ]);
        } else {
            $servicesItem->update(['type' => 'megamenu']);
        }

        // Clean existing columns for services menu
        MegaMenuColumn::where('menu_item_id', $servicesItem->id)->delete();

        // Col 1: MODULAR KITCHENS
        $col1 = MegaMenuColumn::create([
            'menu_item_id' => $servicesItem->id,
            'title' => 'MODULAR KITCHENS',
            'sort_order' => 1,
        ]);

        MegaMenuItem::create([
            'mega_menu_column_id' => $col1->id,
            'label' => 'L-Shaped Kitchens',
            'url' => '/services/modular-kitchen-design?style=L-Shaped',
            'description' => 'HOT',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        MegaMenuItem::create([
            'mega_menu_column_id' => $col1->id,
            'label' => 'Island Kitchens',
            'url' => '/services/modular-kitchen-design?style=Island',
            'description' => 'POPULAR',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        // Col 2: LIVING ROOMS
        $col2 = MegaMenuColumn::create([
            'menu_item_id' => $servicesItem->id,
            'title' => 'LIVING ROOMS',
            'sort_order' => 2,
        ]);

        MegaMenuItem::create([
            'mega_menu_column_id' => $col2->id,
            'label' => 'Modern Luxury',
            'url' => '/services/living-room-interior-design?style=Luxury',
            'description' => 'TRENDING',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        MegaMenuItem::create([
            'mega_menu_column_id' => $col2->id,
            'label' => 'Minimal Scandinavian',
            'url' => '/services/living-room-interior-design?style=Scandinavian',
            'description' => 'MUST HAVE',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        // Col 3: WARDROBES & STORAGE
        $col3 = MegaMenuColumn::create([
            'menu_item_id' => $servicesItem->id,
            'title' => 'WARDROBES & STORAGE',
            'sort_order' => 3,
        ]);

        MegaMenuItem::create([
            'mega_menu_column_id' => $col3->id,
            'label' => 'Sliding Glass Profile',
            'url' => '/services/wardrobe-design?style=Sliding',
            'description' => 'HOT',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        MegaMenuItem::create([
            'mega_menu_column_id' => $col3->id,
            'label' => 'Luxury Walk-in Closets',
            'url' => '/services/wardrobe-design?style=Walk-In',
            'description' => 'POPULAR',
            'sort_order' => 2,
            'is_active' => true,
        ]);
    }
}
