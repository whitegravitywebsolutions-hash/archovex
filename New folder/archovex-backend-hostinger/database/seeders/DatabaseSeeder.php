<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\City;
use App\Models\Category;
use App\Models\Room;
use App\Models\Style;
use App\Models\Material;
use App\Models\DesignPost;
use App\Models\DesignPostImage;
use App\Models\DesignPostFeature;
use App\Models\DesignPostSpecification;
use App\Models\Service;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\MegaMenuColumn;
use App\Models\MegaMenuItem;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use App\Models\Blog;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\Setting;
use App\Models\SocialLink;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. DEFAULT ADMIN USER
        User::updateOrCreate(
            ['email' => 'admin@archovex.com'],
            [
                'name' => 'ARCHOVEX Administrator',
                'password' => Hash::make('ChangeMe@123'),
                'role' => 'SUPER_ADMIN',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // 2. CITIES
        $citiesData = [
            [
                'name' => 'Delhi',
                'slug' => 'delhi',
                'state' => 'Delhi NCR',
                'description' => 'Architectural interior design services for luxury apartments, kothis, and villas across Delhi NCR.',
                'hero_image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
                'address' => 'ARCHOVEX Experience Center, Connaught Place, New Delhi 110001',
                'phone' => '+91 98765 43210',
                'email' => 'delhi@archovex.com',
                'whatsapp' => '+919876543210',
                'meta_title' => 'Best Interior Designers in Delhi | ARCHOVEX INFRA',
                'meta_description' => 'Transform your home in Delhi with ARCHOVEX INFRA. Premium modular kitchens, living rooms, wardrobes, and end-to-end turnkey interior execution.',
            ],
            [
                'name' => 'Gurgaon',
                'slug' => 'gurgaon',
                'state' => 'Haryana',
                'description' => 'Bespeak luxury interior concepts for high-rise condominiums, penthouses, and modern homes in Gurgaon.',
                'hero_image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
                'address' => 'ARCHOVEX Design Studio, Golf Course Road, Sector 54, Gurgaon 122002',
                'phone' => '+91 98765 43211',
                'email' => 'gurgaon@archovex.com',
                'whatsapp' => '+919876543211',
                'meta_title' => 'Luxury Interior Designers in Gurgaon | ARCHOVEX INFRA',
                'meta_description' => 'High-end interior design studio in Gurgaon. Turnkey home interior execution for apartments, villas & penthouses.',
            ],
            [
                'name' => 'Noida',
                'slug' => 'noida',
                'state' => 'Uttar Pradesh',
                'description' => 'Contemporary home interior solutions engineered for modern living in Noida & Greater Noida.',
                'hero_image' => 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
                'address' => 'ARCHOVEX Center, Sector 62, Noida 201301',
                'phone' => '+91 98765 43212',
                'email' => 'noida@archovex.com',
                'whatsapp' => '+919876543212',
                'meta_title' => 'Top Home Interior Designers in Noida | ARCHOVEX INFRA',
                'meta_description' => 'Complete modular interior design and execution services in Noida.',
            ],
            [
                'name' => 'Mumbai',
                'slug' => 'mumbai',
                'state' => 'Maharashtra',
                'description' => 'Smart spatial architectural planning and ultra-luxury modular interiors in Mumbai.',
                'hero_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
                'address' => 'ARCHOVEX Studio, Lower Parel, Mumbai 400013',
                'phone' => '+91 98765 43213',
                'email' => 'mumbai@archovex.com',
                'whatsapp' => '+919876543213',
                'meta_title' => 'Premium Interior Designers in Mumbai | ARCHOVEX INFRA',
                'meta_description' => 'Bespoke apartment & home interior designers in Mumbai.',
            ],
            [
                'name' => 'Bangalore',
                'slug' => 'bangalore',
                'state' => 'Karnataka',
                'description' => 'Modern minimalist & Scandinavian aesthetic interior craft for tech-driven homes in Bangalore.',
                'hero_image' => 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
                'address' => 'ARCHOVEX Hub, Indiranagar, Bengaluru 560038',
                'phone' => '+91 98765 43214',
                'email' => 'bangalore@archovex.com',
                'whatsapp' => '+919876543214',
                'meta_title' => 'Best Home Interior Designers in Bangalore | ARCHOVEX INFRA',
                'meta_description' => 'End-to-end modular kitchens and turnkey interiors in Bangalore.',
            ],
            [
                'name' => 'Pune',
                'slug' => 'pune',
                'state' => 'Maharashtra',
                'description' => 'Thoughtfully crafted residential interior spaces in Pune.',
                'hero_image' => 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
                'address' => 'ARCHOVEX Studio, Baner Road, Pune 411045',
                'phone' => '+91 98765 43215',
                'email' => 'pune@archovex.com',
                'whatsapp' => '+919876543215',
                'meta_title' => 'Turnkey Interior Designers in Pune | ARCHOVEX INFRA',
                'meta_description' => 'Customized modular kitchens, wardrobes & full home interiors in Pune.',
            ],
        ];

        $createdCities = [];
        foreach ($citiesData as $c) {
            $createdCities[$c['slug']] = City::updateOrCreate(['slug' => $c['slug']], $c);
        }

        // 3. SEED CATEGORIES (4 INITIAL REQUIRED)
        $categoriesData = [
            [
                'name' => 'Modular Kitchen Designs',
                'slug' => 'modular-kitchen-designs',
                'short_description' => 'Precision-engineered modular kitchen layouts designed for maximum utility, ergonomic comfort, and architectural elegance.',
                'description' => 'Discover our range of modular kitchens including L-shaped, Island, Parallel, Straight, and U-shaped configurations featuring soft-close German hardware, anti-scratch acrylic finishes, and smart corner storage.',
                'image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 1,
                'meta_title' => 'Modular Kitchen Designs | ARCHOVEX INFRA',
                'meta_description' => 'Explore luxury modular kitchen designs including L-shaped, U-shaped, Parallel and Island kitchens with custom finishes and hardware.',
            ],
            [
                'name' => 'Living Room Designs',
                'slug' => 'living-room-designs',
                'short_description' => 'Sophisticated living room spaces combining custom TV units, architectural false ceilings, ambient lighting, and refined luxury seating.',
                'description' => 'Transform your main living area into an inviting sanctuary of warmth and elegance. Our living room interior designs emphasize harmonious color palettes, custom wall paneling, modular entertainment consoles, and concealed LED mood lighting.',
                'image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 2,
                'meta_title' => 'Living Room Interior Designs | ARCHOVEX INFRA',
                'meta_description' => 'Inspiring living room interior design ideas, TV console units, wall paneling, and luxury living setups.',
            ],
            [
                'name' => 'Wardrobe Designs',
                'slug' => 'wardrobe-designs',
                'short_description' => 'Custom floor-to-ceiling wardrobes featuring sliding aluminum profiles, walk-in closets, tinted glass doors, and organized storage systems.',
                'description' => 'Maximize bedroom storage without compromising on aesthetic luxury. Our wardrobe design collection showcases sliding doors, walk-in dressing spaces, integrated vanity setups, and sensor lighting.',
                'image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 3,
                'meta_title' => 'Custom Wardrobe Designs & Walk-in Closets | ARCHOVEX INFRA',
                'meta_description' => 'Explore floor-to-ceiling sliding wardrobes, tinted glass walk-in closets, and modular bedroom storage solutions.',
            ],
            [
                'name' => 'End-to-end Offerings',
                'slug' => 'end-to-end-offerings',
                'short_description' => 'Complete turnkey interior design and execution for 2BHK, 3BHK, 4BHK apartments, independent villas, and luxury home renovations.',
                'description' => 'Experience hassle-free home interior transformation with our full turnkey interior offerings. From 3D architectural renders to electrical, plumbing, civil work, custom carpentry, and final handover with 10-year warranty.',
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 4,
                'meta_title' => 'End-to-End Turnkey Home Interiors | ARCHOVEX INFRA',
                'meta_description' => 'Complete turnkey home interior design and execution for 2BHK, 3BHK apartments and luxury villas.',
            ],
        ];

        $createdCategories = [];
        foreach ($categoriesData as $cat) {
            $createdCategories[$cat['slug']] = Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 4. TAXONOMIES (Rooms, Styles, Materials)
        $rooms = ['Kitchen', 'Living Room', 'Bedroom', 'Dining Room', 'Bathroom', 'Foyer', 'Pooja Room', 'Home Office'];
        foreach ($rooms as $r) {
            Room::updateOrCreate(['slug' => str()->slug($r)], ['name' => $r]);
        }

        $styles = ['Modern', 'Luxury', 'Minimalist', 'Contemporary', 'Scandinavian', 'Industrial', 'Traditional'];
        foreach ($styles as $s) {
            Style::updateOrCreate(['slug' => str()->slug($s)], ['name' => $s]);
        }

        $materials = ['Engineered Wood', 'Acrylic', 'Quartz', 'Tinted Glass', 'High-Gloss Laminate', 'Solid Teak', 'Veneer'];
        foreach ($materials as $m) {
            Material::updateOrCreate(['slug' => str()->slug($m)], ['name' => $m]);
        }

        // 5. DESIGN POSTS SEED DATA

        // A) MODULAR KITCHEN POSTS (5+)
        $kitchenPosts = [
            [
                'title' => 'Modern L-Shaped Modular Kitchen',
                'slug' => 'modern-l-shaped-modular-kitchen',
                'short_description' => 'Sleek white and walnut wood dual-tone L-shaped kitchen with seamless acrylic shutters and quartz countertop.',
                'description' => 'This Modern L-Shaped Modular Kitchen is engineered to optimize corner space while maintaining a crisp, clutter-free aesthetic. Features premium Blum soft-close tandem drawers, tall pantry unit, and under-cabinet LED strip lights.',
                'style' => 'Modern',
                'room_type' => 'Kitchen',
                'layout' => 'L-Shaped',
                'dimensions' => '12 x 10 Feet',
                'colour' => 'White + Walnut Wood',
                'material' => 'Engineered Wood + Acrylic',
                'finish' => 'High-Gloss Acrylic',
                'budget_min' => 450000.00,
                'budget_max' => 650000.00,
                'property_type' => '3 BHK Apartment',
                'area' => '120 Sq Ft',
                'location' => 'Golf Course Road, Gurgaon',
                'featured_image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 1,
                'images' => [
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Modern'],
                    ['label' => 'Layout', 'value' => 'L-Shaped'],
                    ['label' => 'Countertop', 'value' => 'Engineered Italian Quartz'],
                    ['label' => 'Hardware', 'value' => 'Blum Soft-Close (Germany)'],
                    ['label' => 'Shutters', 'value' => '18mm HDMR with Anti-Scratch Acrylic'],
                    ['label' => 'Dimensions', 'value' => '12 x 10 Feet'],
                    ['label' => 'Warranty', 'value' => '10 Years Warranty'],
                ],
                'features' => [
                    'German soft-close tandem drawers',
                    'Built-in tall pantry pull-out unit',
                    'Magic corner storage solution',
                    'Concealed under-cabinet LED task illumination',
                    'Scratch & stain resistant quartz counter',
                    'Integrated chimney & hob ducting',
                ],
            ],
            [
                'title' => 'Luxury Island Modular Kitchen',
                'slug' => 'luxury-island-kitchen',
                'short_description' => 'Opulent chef kitchen featuring a central island breakfast counter, matte charcoal shutters, and brass accent details.',
                'description' => 'Designed for spacious homes and gourmet entertaining, this Luxury Island Kitchen integrates a multi-functional island prep zone with integrated sink, breakfast bar seating, and floor-to-ceiling glass display cabinets.',
                'style' => 'Luxury',
                'room_type' => 'Kitchen',
                'layout' => 'Island',
                'dimensions' => '16 x 14 Feet',
                'colour' => 'Matte Charcoal & Gold',
                'material' => 'HDMR + Super-Matte PU',
                'finish' => 'Super-Matte PU Polish',
                'budget_min' => 750000.00,
                'budget_max' => 1100000.00,
                'property_type' => '4 BHK Villa / Penthouse',
                'area' => '224 Sq Ft',
                'location' => 'Greater Kailash, Delhi',
                'featured_image' => 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 2,
                'images' => [
                    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Luxury'],
                    ['label' => 'Layout', 'value' => 'Island'],
                    ['label' => 'Countertop', 'value' => 'Nero Marquina Marble Look Quartz'],
                    ['label' => 'Hardware', 'value' => 'Hettich Atira Push-to-Open'],
                    ['label' => 'Dimensions', 'value' => '16 x 14 Feet'],
                    ['label' => 'Warranty', 'value' => '10 Years Warranty'],
                ],
                'features' => [
                    'Central island breakfast table setup',
                    'Fluted glass upper display units with sensor LED',
                    'Dual sink zone with pull-out brass faucet',
                    'Smart microwave & oven built-in tall unit',
                ],
            ],
            [
                'title' => 'Minimal White Modular Kitchen',
                'slug' => 'minimal-white-modular-kitchen',
                'short_description' => 'Clean handleless seamless white kitchen for compact urban spaces.',
                'description' => 'Bright, airy, and ultra-functional handleless kitchen with Gola profile channels and seamless white gloss lamination.',
                'style' => 'Minimalist',
                'room_type' => 'Kitchen',
                'layout' => 'Parallel',
                'dimensions' => '10 x 8 Feet',
                'colour' => 'Pure White',
                'material' => 'Marine Plywood + Acrylic',
                'finish' => 'Gloss Acrylic',
                'budget_min' => 320000.00,
                'budget_max' => 450000.00,
                'property_type' => '2 BHK Apartment',
                'area' => '80 Sq Ft',
                'location' => 'Whitefield, Bangalore',
                'featured_image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 3,
                'images' => [
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Minimalist'],
                    ['label' => 'Layout', 'value' => 'Parallel'],
                    ['label' => 'Countertop', 'value' => 'White Nano Quartz'],
                ],
                'features' => [
                    'Aluminum Gola handleless channel profiles',
                    'Moisture-proof marine ply carcass',
                    'Compact spice & bottle pull-out rack',
                ],
            ],
            [
                'title' => 'Wooden Finish Modular Kitchen',
                'slug' => 'wooden-finish-modular-kitchen',
                'short_description' => 'Warm rustic teak veneer paired with dark slate gray cabinets.',
                'description' => 'Bring organic warmth to your home with natural wood veneer upper cabinets and robust slate gray base storage.',
                'style' => 'Contemporary',
                'room_type' => 'Kitchen',
                'layout' => 'U-Shaped',
                'dimensions' => '12 x 12 Feet',
                'colour' => 'Natural Oak & Slate Gray',
                'material' => 'BWP Ply + Natural Veneer',
                'finish' => 'Matte PU Clear Coat',
                'budget_min' => 520000.00,
                'budget_max' => 700000.00,
                'property_type' => '3 BHK Apartment',
                'area' => '144 Sq Ft',
                'location' => 'Baner, Pune',
                'featured_image' => 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 4,
                'images' => [
                    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Contemporary'],
                    ['label' => 'Layout', 'value' => 'U-Shaped'],
                ],
                'features' => [
                    'Natural European oak veneer finish',
                    'Full height corner carousel unit',
                    'Soft close cutlery organizers',
                ],
            ],
            [
                'title' => 'Parallel Executive Modular Kitchen',
                'slug' => 'parallel-executive-kitchen',
                'short_description' => 'High-efficiency parallel kitchen ideal for heavy Indian cooking routines.',
                'description' => 'Designed with twin working counters separating wet and dry cooking zones for optimum ergonomic workflow.',
                'style' => 'Modern',
                'room_type' => 'Kitchen',
                'layout' => 'Parallel',
                'dimensions' => '14 x 8 Feet',
                'colour' => 'Champagne & Matte Black',
                'material' => 'HDMR Board',
                'finish' => 'Laminate + Metallic Accent',
                'budget_min' => 400000.00,
                'budget_max' => 580000.00,
                'property_type' => '3 BHK Apartment',
                'area' => '112 Sq Ft',
                'location' => 'Noida Sector 75',
                'featured_image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 5,
                'images' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Modern'],
                    ['label' => 'Layout', 'value' => 'Parallel'],
                ],
                'features' => [
                    'Twin prep counters for wet/dry separation',
                    'Heavy-duty stainless steel wire baskets',
                    'Heat resistant backsplash tiles',
                ],
            ],
        ];

        foreach ($kitchenPosts as $kpData) {
            $imgs = $kpData['images'];
            $specs = $kpData['specs'];
            $feats = $kpData['features'];
            unset($kpData['images'], $kpData['specs'], $kpData['features']);

            $kpData['category_id'] = $createdCategories['modular-kitchen-designs']->id;
            $kpData['city_id'] = $createdCities['gurgaon']->id;

            $post = DesignPost::updateOrCreate(['slug' => $kpData['slug']], $kpData);

            // Images
            foreach ($imgs as $idx => $imgUrl) {
                DesignPostImage::updateOrCreate([
                    'design_post_id' => $post->id,
                    'image' => $imgUrl,
                ], [
                    'alt_text' => $post->title . ' Image ' . ($idx + 1),
                    'sort_order' => $idx + 1,
                    'is_primary' => ($idx === 0),
                    'is_mobile' => ($idx === 0 || $idx === 1),
                ]);
            }

            // Specs
            foreach ($specs as $sIdx => $sp) {
                DesignPostSpecification::create([
                    'design_post_id' => $post->id,
                    'label' => $sp['label'],
                    'value' => $sp['value'],
                    'sort_order' => $sIdx + 1,
                ]);
            }

            // Features
            foreach ($feats as $fIdx => $ft) {
                DesignPostFeature::create([
                    'design_post_id' => $post->id,
                    'feature' => $ft,
                    'sort_order' => $fIdx + 1,
                ]);
            }
        }

        // B) LIVING ROOM POSTS (5+)
        $livingPosts = [
            [
                'title' => 'Modern Luxury Living Room',
                'slug' => 'modern-luxury-living-room',
                'short_description' => 'Architectural living room with marble wall paneling, floating TV console, and ambient warm cove lighting.',
                'description' => 'An expansive open-plan living room crafted with Italian Statuario marble wall accents, customized plush velvet seating, fluted louvers, and smart home lighting integration.',
                'style' => 'Luxury',
                'room_type' => 'Living Room',
                'layout' => 'Open Concept',
                'dimensions' => '20 x 16 Feet',
                'colour' => 'Beige, Gold & Charcoal',
                'material' => 'Italian Marble + Fluted Wood',
                'finish' => 'PU Polish & Matte Metal',
                'budget_min' => 600000.00,
                'budget_max' => 950000.00,
                'property_type' => '4 BHK Apartment',
                'area' => '320 Sq Ft',
                'location' => 'Golf Course Extension, Gurgaon',
                'featured_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 1,
                'images' => [
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Luxury'],
                    ['label' => 'TV Console Wall', 'value' => 'Bookmatched Italian Marble'],
                    ['label' => 'Ceiling', 'value' => 'Dual Layer Gypsum False Ceiling'],
                    ['label' => 'Lighting', 'value' => 'Smart COB & Magnetic Track Lights'],
                ],
                'features' => [
                    'Statuary marble backdrop wall with metallic brass inlay',
                    'Floating media console with push-to-open drawers',
                    'Integrated concealed soundbar slot',
                    'Custom fluted acoustic wooden panelling',
                ],
            ],
            [
                'title' => 'Minimal Scandinavian Living Room',
                'slug' => 'minimal-living-room',
                'short_description' => 'Serene neutral-toned living space showcasing natural light, oak wood, and soft linen furniture.',
                'description' => 'Designed for zen, relaxed living, featuring light oak tones, micro-cement finished walls, and minimalistic floating shelves.',
                'style' => 'Scandinavian',
                'room_type' => 'Living Room',
                'layout' => 'Regular',
                'dimensions' => '16 x 14 Feet',
                'colour' => 'Warm Cream & Light Oak',
                'material' => 'Solid Oak & Linen',
                'finish' => 'Matte Natural',
                'budget_min' => 380000.00,
                'budget_max' => 520000.00,
                'property_type' => '3 BHK Apartment',
                'area' => '224 Sq Ft',
                'location' => 'Indiranagar, Bangalore',
                'featured_image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 2,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Scandinavian'],
                    ['label' => 'Flooring', 'value' => 'Engineered Oak Wood'],
                ],
                'features' => [
                    'Breathable linen fabric L-sectional sofa',
                    'Low-profile minimalist TV entertainment panel',
                    'Recessed ambient warm perimeter lighting',
                ],
            ],
            [
                'title' => 'Contemporary TV Unit Living Room',
                'slug' => 'contemporary-tv-unit-living-room',
                'short_description' => 'Feature TV wall unit with charcoal stone veneer, backlighting, and storage niches.',
                'description' => 'Focuses on entertainment and wall aesthetics with slate stone texture and hidden wire management system.',
                'style' => 'Contemporary',
                'room_type' => 'Living Room',
                'layout' => 'Regular',
                'dimensions' => '18 x 14 Feet',
                'colour' => 'Charcoal & Smoked Ash',
                'material' => 'Stone Veneer & MDF',
                'finish' => 'Matte Stone',
                'budget_min' => 420000.00,
                'budget_max' => 580000.00,
                'property_type' => '3 BHK Apartment',
                'area' => '252 Sq Ft',
                'location' => 'Vasant Kunj, Delhi',
                'featured_image' => 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 3,
                'images' => [
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Contemporary'],
                ],
                'features' => [
                    'Real flexible stone veneer wall cladding',
                    'Warm 3000K LED perimeter cove glow',
                    'Hidden cable routing channels',
                ],
            ],
            [
                'title' => 'Premium Wooden Living Room',
                'slug' => 'premium-wooden-living-room',
                'short_description' => 'Classic Indian luxury living space with warm teak paneling and custom craft furniture.',
                'description' => 'Combines traditional craftsmanship with modern comfort through solid teak rafters and custom louvers.',
                'style' => 'Traditional',
                'room_type' => 'Living Room',
                'layout' => 'Regular',
                'dimensions' => '16 x 15 Feet',
                'colour' => 'Teak & Ivory',
                'material' => 'Teak Wood & Brass',
                'finish' => 'Clear Satin Polish',
                'budget_min' => 550000.00,
                'budget_max' => 750000.00,
                'property_type' => 'Independent House',
                'area' => '240 Sq Ft',
                'location' => 'Juhu, Mumbai',
                'featured_image' => 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 4,
                'images' => [
                    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Traditional Luxury'],
                ],
                'features' => [
                    'Handcrafted solid teak ceiling rafters',
                    'Brass inlay wall partition screens',
                ],
            ],
            [
                'title' => 'Compact Apartment Living Room',
                'slug' => 'compact-apartment-living-room',
                'short_description' => 'Smart multi-functional living design tailored for 2BHK urban city homes.',
                'description' => 'Space-saving layout featuring wall-mounted folding dining table, slim TV panel, and sofa with built-in bottom drawers.',
                'style' => 'Modern',
                'room_type' => 'Living Room',
                'layout' => 'Compact',
                'dimensions' => '14 x 12 Feet',
                'colour' => 'Pastel Mint & Light Gray',
                'material' => 'Commercial Ply + Laminate',
                'finish' => 'Matte Laminate',
                'budget_min' => 280000.00,
                'budget_max' => 390000.00,
                'property_type' => '2 BHK Apartment',
                'area' => '168 Sq Ft',
                'location' => 'Kalyani Nagar, Pune',
                'featured_image' => 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 5,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Modern Compact'],
                ],
                'features' => [
                    'Multi-functional space saving furniture',
                    'Slimline floating TV unit',
                ],
            ],
        ];

        foreach ($livingPosts as $lpData) {
            $imgs = $lpData['images'];
            $specs = $lpData['specs'];
            $feats = $lpData['features'];
            unset($lpData['images'], $lpData['specs'], $lpData['features']);

            $lpData['category_id'] = $createdCategories['living-room-designs']->id;
            $lpData['city_id'] = $createdCities['delhi']->id;

            $post = DesignPost::updateOrCreate(['slug' => $lpData['slug']], $lpData);

            foreach ($imgs as $idx => $imgUrl) {
                DesignPostImage::updateOrCreate([
                    'design_post_id' => $post->id,
                    'image' => $imgUrl,
                ], [
                    'alt_text' => $post->title . ' Image ' . ($idx + 1),
                    'sort_order' => $idx + 1,
                    'is_primary' => ($idx === 0),
                    'is_mobile' => ($idx === 0),
                ]);
            }

            foreach ($specs as $sIdx => $sp) {
                DesignPostSpecification::create([
                    'design_post_id' => $post->id,
                    'label' => $sp['label'],
                    'value' => $sp['value'],
                    'sort_order' => $sIdx + 1,
                ]);
            }

            foreach ($feats as $fIdx => $ft) {
                DesignPostFeature::create([
                    'design_post_id' => $post->id,
                    'feature' => $ft,
                    'sort_order' => $fIdx + 1,
                ]);
            }
        }

        // C) WARDROBE POSTS (5+)
        $wardrobePosts = [
            [
                'title' => 'Sliding Glass Profile Wardrobe',
                'slug' => 'sliding-glass-profile-wardrobe',
                'short_description' => 'Floor-to-ceiling sliding wardrobe with bronze tinted glass, black aluminum profile, and automatic sensor LED lighting.',
                'description' => 'State-of-the-art sliding wardrobe engineered with ultra-smooth Italian anti-jump tracks, dark champagne interiors, dedicated watch drawers, and full-length mirror shutters.',
                'style' => 'Modern',
                'room_type' => 'Bedroom',
                'layout' => 'Sliding 3-Door',
                'dimensions' => '9 x 8.5 Feet',
                'colour' => 'Bronze Glass & Charcoal',
                'material' => 'Aluminum Profile + Tinted Glass',
                'finish' => 'Translucent Glass',
                'budget_min' => 220000.00,
                'budget_max' => 340000.00,
                'property_type' => 'Master Bedroom',
                'area' => '76 Sq Ft',
                'location' => 'DLF Phase 5, Gurgaon',
                'featured_image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 1,
                'images' => [
                    'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Mechanism', 'value' => 'Anti-Jump Soft Close Sliding System'],
                    ['label' => 'Glass', 'value' => '6mm Toughened Tinted Bronze Glass'],
                    ['label' => 'Lighting', 'value' => 'Automated Motion Sensor Strip Lights'],
                ],
                'features' => [
                    'Bronze tinted toughened safety glass doors',
                    'Velvet lined jewelry organizer drawer',
                    'Integrated digital bio-metric safe box',
                    'Full height suit hanging rails',
                ],
            ],
            [
                'title' => 'Luxury Walk-in Wardrobe',
                'slug' => 'luxury-walk-in-wardrobe',
                'short_description' => 'Bespoke walk-in closet with island vanity table, glass shoes tower, and mood lighting.',
                'description' => 'Dedicated master dressing suite designed with open shelving modules, leather-upholstered seating island, and glass accessory displays.',
                'style' => 'Luxury',
                'room_type' => 'Master Suite',
                'layout' => 'Walk-In U-Shape',
                'dimensions' => '14 x 10 Feet',
                'colour' => 'Smoked Oak & Gold',
                'material' => 'High-Density Fiberboard + Leatherette',
                'finish' => 'Textured Veneer',
                'budget_min' => 450000.00,
                'budget_max' => 650000.00,
                'property_type' => 'Villa Suite',
                'area' => '140 Sq Ft',
                'location' => 'Sainik Farms, Delhi',
                'featured_image' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 2,
                'images' => [
                    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Layout', 'value' => 'Walk-In U-Shape'],
                    ['label' => 'Center Island', 'value' => 'Quartz Top with Leatherette Drawers'],
                ],
                'features' => [
                    'Illuminated shoe glass tower holding 40+ pairs',
                    'Dual vanity mirror setup with ring LED light',
                    'Soft close pull-down trouser racks',
                ],
            ],
            [
                'title' => 'Full Height Loft Wardrobe',
                'slug' => 'full-height-loft-wardrobe',
                'short_description' => 'Seamless floor-to-ceiling hinged wardrobe with top loft storage.',
                'description' => 'Maximizes vertical wall space with overhead seasonal luggage storage and custom vanity nook.',
                'style' => 'Contemporary',
                'room_type' => 'Bedroom',
                'layout' => 'Hinged 4-Door + Loft',
                'dimensions' => '10 x 9.5 Feet',
                'colour' => 'Sage Green & Warm Cream',
                'material' => 'Commercial Ply + Super Matte Laminate',
                'finish' => 'Super Matte Laminate',
                'budget_min' => 180000.00,
                'budget_max' => 260000.00,
                'property_type' => '3 BHK Apartment',
                'area' => '85 Sq Ft',
                'location' => 'Powai, Mumbai',
                'featured_image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 3,
                'images' => [
                    'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Style', 'value' => 'Contemporary'],
                ],
                'features' => [
                    'Top loft storage for heavy suitcases',
                    'Integrated dresser with secret mirror storage',
                ],
            ],
            [
                'title' => 'Modern Bedroom Wardrobe with Study',
                'slug' => 'modern-bedroom-wardrobe-with-study',
                'short_description' => 'Integrated wardrobe unit combining clothes storage with a sleek work-from-home desk.',
                'description' => 'Perfect dual-purpose furniture piece blending a 3-door wardrobe with a study computer desk and floating book shelves.',
                'style' => 'Modern',
                'room_type' => 'Bedroom / Study',
                'layout' => 'L-Shape Combo',
                'dimensions' => '11 x 8 Feet',
                'colour' => 'Scandinavian Birch & Off White',
                'material' => 'Engineered Wood + Laminate',
                'finish' => 'Textured Woodgrain',
                'budget_min' => 195000.00,
                'budget_max' => 270000.00,
                'property_type' => 'Kids / Guest Room',
                'area' => '88 Sq Ft',
                'location' => 'Noida Sector 150',
                'featured_image' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 4,
                'images' => [
                    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Combo', 'value' => 'Wardrobe + Integrated Study Desk'],
                ],
                'features' => [
                    'Workstation desk with wire grommet & drawers',
                    'Open bookshelf display cabinet',
                ],
            ],
            [
                'title' => 'Premium Wooden Teak Wardrobe',
                'slug' => 'premium-wooden-wardrobe',
                'short_description' => 'Rich dark teak finish 4-door wardrobe with traditional louvers and solid brass handles.',
                'description' => 'Timeless craftsmanship using premium teak wood veneer with brass filigree hardware.',
                'style' => 'Traditional',
                'room_type' => 'Bedroom',
                'layout' => 'Hinged 4-Door',
                'dimensions' => '8 x 8 Feet',
                'colour' => 'Dark Walnut & Brass',
                'material' => 'Teak Veneer + BWP Ply',
                'finish' => 'Rich Satin Polish',
                'budget_min' => 240000.00,
                'budget_max' => 330000.00,
                'property_type' => 'Independent Home',
                'area' => '64 Sq Ft',
                'location' => 'Koregaon Park, Pune',
                'featured_image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'sort_order' => 5,
                'images' => [
                    'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Wood', 'value' => 'Grade-A Teak Veneer'],
                ],
                'features' => [
                    'Solid brass designer handles',
                    'Internal tie & belt pull-outs',
                ],
            ],
        ];

        foreach ($wardrobePosts as $wpData) {
            $imgs = $wpData['images'];
            $specs = $wpData['specs'];
            $feats = $wpData['features'];
            unset($wpData['images'], $kpData['specs'], $wpData['specs'], $wpData['features']);

            $wpData['category_id'] = $createdCategories['wardrobe-designs']->id;
            $wpData['city_id'] = $createdCities['gurgaon']->id;

            $post = DesignPost::updateOrCreate(['slug' => $wpData['slug']], $wpData);

            foreach ($imgs as $idx => $imgUrl) {
                DesignPostImage::updateOrCreate([
                    'design_post_id' => $post->id,
                    'image' => $imgUrl,
                ], [
                    'alt_text' => $post->title . ' Image ' . ($idx + 1),
                    'sort_order' => $idx + 1,
                    'is_primary' => ($idx === 0),
                    'is_mobile' => ($idx === 0),
                ]);
            }

            foreach ($specs as $sIdx => $sp) {
                DesignPostSpecification::create([
                    'design_post_id' => $post->id,
                    'label' => $sp['label'],
                    'value' => $sp['value'],
                    'sort_order' => $sIdx + 1,
                ]);
            }

            foreach ($feats as $fIdx => $ft) {
                DesignPostFeature::create([
                    'design_post_id' => $post->id,
                    'feature' => $ft,
                    'sort_order' => $fIdx + 1,
                ]);
            }
        }

        // D) END-TO-END OFFERINGS (3+)
        $endToEndPosts = [
            [
                'title' => 'Complete 2BHK Interior Solution',
                'slug' => 'complete-2bhk-interior',
                'short_description' => 'Comprehensive turnkey interior package for 2BHK apartments including modular kitchen, living room, master bedroom, and lighting.',
                'description' => 'Our Complete 2BHK Interior Solution covers end-to-end design and on-site execution. Includes acrylic modular kitchen with German hardware, living room TV wall unit with false ceiling, master bedroom sliding wardrobe, guest room wardrobe, electrical work, painting, and deep cleaning before handover.',
                'style' => 'Modern Turnkey',
                'property_type' => '2 BHK Apartment',
                'area' => '950 – 1200 Sq Ft',
                'budget_min' => 850000.00,
                'budget_max' => 1250000.00,
                'location' => 'Noida & Gurgaon',
                'featured_image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 1,
                'images' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Package Type', 'value' => 'Full 2BHK Turnkey'],
                    ['label' => 'Execution Timeline', 'value' => '45 Working Days Guaranteed'],
                    ['label' => 'Warranty', 'value' => '10-Year Material Warranty'],
                    ['label' => 'Services Included', 'value' => 'Design + Carpentry + False Ceiling + Electrical + Painting'],
                ],
                'features' => [
                    '3D architectural VR walkthrough render',
                    'Full acrylic modular kitchen with quartz counter',
                    'Living room wall panelling & TV unit',
                    'Master bedroom sliding glass wardrobe',
                    'Guest bedroom floor-to-ceiling wardrobe',
                    'Complete false ceiling with COB lighting',
                ],
            ],
            [
                'title' => 'Complete 3BHK Turnkey Interior',
                'slug' => 'complete-3bhk-interior',
                'short_description' => 'Luxury 3BHK full home interior design with custom furniture, island kitchen, and smart home lighting.',
                'description' => 'Designed for premium lifestyle living in modern high-rise apartments. Covers foyer accent design, island kitchen setup, living & dining panelling, 3 bedroom wardrobes, pooja unit, and balcony deck setup.',
                'style' => 'Luxury Turnkey',
                'property_type' => '3 BHK Apartment',
                'area' => '1500 – 2100 Sq Ft',
                'budget_min' => 1400000.00,
                'budget_max' => 2200000.00,
                'location' => 'Delhi NCR, Mumbai & Bangalore',
                'featured_image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 2,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Package Type', 'value' => 'Full 3BHK Luxury Turnkey'],
                    ['label' => 'Execution Timeline', 'value' => '60 Working Days Guaranteed'],
                ],
                'features' => [
                    'Dedicated project manager & site supervisor',
                    'Italian marble look living room TV unit',
                    'Island kitchen with built-in appliances',
                    'Walk-in closet for master suite',
                    'Pooja room brass filigree marble mandir',
                ],
            ],
            [
                'title' => 'Full Home Villa Renovation',
                'slug' => 'full-home-interior',
                'short_description' => 'Bespoke civil, structural, and luxury interior overhaul for villas, kothis, and penthouses.',
                'description' => 'End-to-end luxury architectural transformation including civil demolition, floor relaying, plumbing overhaul, custom woodwork, and landscape balcony design.',
                'style' => 'Ultra Luxury',
                'property_type' => 'Independent Villa / Penthouse',
                'area' => '3000+ Sq Ft',
                'budget_min' => 2800000.00,
                'budget_max' => 5000000.00,
                'location' => 'Delhi NCR',
                'featured_image' => 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'sort_order' => 3,
                'images' => [
                    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                ],
                'specs' => [
                    ['label' => 'Scope', 'value' => 'Complete Architectural & Civil Interior Overhaul'],
                ],
                'features' => [
                    'Civil structure modification & floor relaying',
                    'Home automation & motorized curtain tracks',
                    'Custom solid teak furniture crafting',
                ],
            ],
        ];

        foreach ($endToEndPosts as $eteData) {
            $imgs = $eteData['images'];
            $specs = $eteData['specs'];
            $feats = $eteData['features'];
            unset($eteData['images'], $eteData['specs'], $eteData['features']);

            $eteData['category_id'] = $createdCategories['end-to-end-offerings']->id;
            $eteData['city_id'] = $createdCities['delhi']->id;

            $post = DesignPost::updateOrCreate(['slug' => $eteData['slug']], $eteData);

            foreach ($imgs as $idx => $imgUrl) {
                DesignPostImage::updateOrCreate([
                    'design_post_id' => $post->id,
                    'image' => $imgUrl,
                ], [
                    'alt_text' => $post->title . ' Image ' . ($idx + 1),
                    'sort_order' => $idx + 1,
                    'is_primary' => ($idx === 0),
                    'is_mobile' => ($idx === 0),
                ]);
            }

            foreach ($specs as $sIdx => $sp) {
                DesignPostSpecification::create([
                    'design_post_id' => $post->id,
                    'label' => $sp['label'],
                    'value' => $sp['value'],
                    'sort_order' => $sIdx + 1,
                ]);
            }

            foreach ($feats as $fIdx => $ft) {
                DesignPostFeature::create([
                    'design_post_id' => $post->id,
                    'feature' => $ft,
                    'sort_order' => $fIdx + 1,
                ]);
            }
        }

        // 6. SERVICES SEED DATA
        $servicesData = [
            [
                'title' => 'Full Home Interiors',
                'slug' => 'full-home-interiors',
                'short_description' => 'Complete turnkey interior design and execution for new apartments and villas.',
                'description' => 'From 3D spatial layout planning to final polish, we handle carpentry, false ceilings, painting, electricals, and soft furnishings under one roof with a 10-year warranty.',
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'home',
                'price_from' => 750000.00,
                'is_featured' => true,
            ],
            [
                'title' => 'Modular Kitchen Design',
                'slug' => 'modular-kitchen',
                'short_description' => 'Custom ergonomic modular kitchens with German hardware and waterproof materials.',
                'description' => 'L-Shaped, U-Shaped, Parallel, and Island modular kitchens tailored to Indian cooking habits with 10-year anti-warp guarantees.',
                'image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'utensils',
                'price_from' => 250000.00,
                'is_featured' => true,
            ],
            [
                'title' => 'Custom Wardrobes & Storage',
                'slug' => 'wardrobes',
                'short_description' => 'Floor-to-ceiling sliding, glass profile, and walk-in closet systems.',
                'description' => 'Bespoke bedroom wardrobes equipped with automated motion-sensor lights, jewelry organizers, trouser pull-outs, and biometric safes.',
                'image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'door-closed',
                'price_from' => 150000.00,
                'is_featured' => true,
            ],
            [
                'title' => 'Living Room & Entertainment Units',
                'slug' => 'living-room',
                'short_description' => 'Architectural TV feature walls, marble panelling, and ceiling lighting.',
                'description' => 'Stunning entertainment centers, acoustically panelled media walls, and ambient LED cove ceiling lighting setups.',
                'image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'tv',
                'price_from' => 180000.00,
                'is_featured' => true,
            ],
            [
                'title' => 'Complete Home Renovation',
                'slug' => 'renovation',
                'short_description' => 'Comprehensive civil demolition, plumbing, electrical, and aesthetic makeover.',
                'description' => 'Breathe new life into older properties with modern open-concept wall removals, Italian marble floor polishing, and smart home electrical wiring.',
                'image' => 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                'icon' => 'hammer',
                'price_from' => 500000.00,
                'is_featured' => true,
            ],
        ];

        foreach ($servicesData as $sd) {
            Service::updateOrCreate(['slug' => $sd['slug']], $sd);
        }

        // 7. PROJECTS SEED DATA
        $projectsData = [
            [
                'title' => 'Luxury 3BHK Condominium in DLF Magnolias',
                'slug' => 'luxury-3bhk-dlf-magnolias',
                'client_name' => 'Mr. & Mrs. Malhotra',
                'city_id' => $createdCities['gurgaon']->id,
                'property_type' => '3 BHK Apartment',
                'area' => '2,400 Sq Ft',
                'budget' => '₹24 Lakhs',
                'duration' => '55 Days',
                'description' => 'A sophisticated high-rise residence featuring warm oak wall veneers, an Italian quartz kitchen island, and custom motorized drapery.',
                'featured_image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                'completion_date' => '2026-03-15',
                'is_featured' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'title' => 'Modern Minimalist Kothi in South Delhi',
                'slug' => 'modern-kothi-south-delhi',
                'client_name' => 'Dr. A. Kapoor',
                'city_id' => $createdCities['delhi']->id,
                'property_type' => 'Independent Kothi',
                'area' => '3,800 Sq Ft',
                'budget' => '₹42 Lakhs',
                'duration' => '75 Days',
                'description' => 'Complete architectural makeover of a multi-level villa incorporating open courtyard lighting, teak wood rafters, and fluted glass partitions.',
                'featured_image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'completion_date' => '2026-01-20',
                'is_featured' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'title' => 'Contemporary 2BHK Apartment in Indiranagar',
                'slug' => 'contemporary-2bhk-indiranagar',
                'client_name' => 'Rohan & Ananya',
                'city_id' => $createdCities['bangalore']->id,
                'property_type' => '2 BHK Apartment',
                'area' => '1,150 Sq Ft',
                'budget' => '₹12 Lakhs',
                'duration' => '40 Days',
                'description' => 'Nordic minimalist home designed with space-saving furniture, handleless kitchen cabinets, and bright pastel accent walls.',
                'featured_image' => 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
                'completion_date' => '2026-05-10',
                'is_featured' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
        ];

        foreach ($projectsData as $proj) {
            $pImgs = $proj['images'];
            unset($proj['images']);

            $pObj = Project::updateOrCreate(['slug' => $proj['slug']], $proj);

            foreach ($pImgs as $idx => $pUrl) {
                ProjectImage::create([
                    'project_id' => $pObj->id,
                    'image' => $pUrl,
                    'sort_order' => $idx + 1,
                ]);
            }
        }

        // 8. TESTIMONIALS SEED DATA
        $testimonialsData = [
            [
                'client_name' => 'Vikram & Radhika Sharma',
                'city_id' => $createdCities['gurgaon']->id,
                'project_type' => '4 BHK Penthouse Interior',
                'review' => 'ARCHOVEX delivered our dream home in Gurgaon 5 days ahead of schedule! The modular kitchen acrylic finish and master wardrobe glass profiles are outstanding.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'client_name' => 'Siddharth Varma',
                'city_id' => $createdCities['delhi']->id,
                'project_type' => '3 BHK Modular Kitchen & Living',
                'review' => 'Extremely professional team. Their 3D renders were 100% matched by the actual execution. The German hardware quality in the kitchen is top notch.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            ],
            [
                'client_name' => 'Priya & Arjun Nair',
                'city_id' => $createdCities['bangalore']->id,
                'project_type' => 'Complete 2BHK Turnkey Interior',
                'review' => 'Transparent pricing, no hidden costs during execution, and excellent customer service. Highly recommend ARCHOVEX INFRA for complete home interiors!',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
            ],
        ];

        foreach ($testimonialsData as $tIdx => $tData) {
            $tData['sort_order'] = $tIdx + 1;
            Testimonial::create($tData);
        }

        // 9. FAQS SEED DATA
        $faqsData = [
            [
                'question' => 'How much does complete home interior design cost with ARCHOVEX?',
                'answer' => 'Our complete 2BHK interior solutions start from ₹8.5 Lakhs, while 3BHK turnkey interiors start from ₹14 Lakhs. Final pricing depends on your selected materials, customized storage scope, and hardware choices.',
                'category_slug' => 'pricing',
            ],
            [
                'question' => 'What warranty does ARCHOVEX INFRA provide on modular interiors?',
                'answer' => 'We offer a flat 10-year warranty on all factory-manufactured modular kitchens, wardrobes, and storage units covering manufacturing defects, shutter warping, and hardware functionality.',
                'category_slug' => 'warranty',
            ],
            [
                'question' => 'What is the typical execution timeline for a turnkey project?',
                'answer' => 'Our standard delivery timeline is 45 working days for 2BHK apartments and 60 working days for 3BHK/4BHK apartments, backed by our on-time delivery guarantee.',
                'category_slug' => 'timeline',
            ],
            [
                'question' => 'Can I customize design materials, colors, and hardware?',
                'answer' => 'Yes, 100%! All our designs are fully customizable. You can select from acrylic, PU polish, marine ply, quartz countertops, glass profiles, and top European hardware brands like Blum and Hettich.',
                'category_slug' => 'customization',
            ],
            [
                'question' => 'Do you provide 3D architectural renders before execution?',
                'answer' => 'Yes! Our design process includes high-definition 3D renders and VR walkthroughs so you can visualize your exact home interior before site production begins.',
                'category_slug' => 'design',
            ],
        ];

        foreach ($faqsData as $fIdx => $fData) {
            $fData['sort_order'] = $fIdx + 1;
            Faq::create($fData);
        }

        // 10. BLOGS / GUIDES SEED DATA
        $blogCat = BlogCategory::updateOrCreate(['slug' => 'design-guides'], ['name' => 'Interior Design Guides']);
        $blogsData = [
            [
                'title' => 'Top 10 Modular Kitchen Layout Ideas for Modern Indian Homes',
                'slug' => 'modular-kitchen-design-ideas',
                'excerpt' => 'Discover how to choose between L-shaped, parallel, and island modular kitchen layouts for maximum ergonomics and storage efficiency.',
                'content' => '<p>Designing a modular kitchen in India requires balancing heavy cooking demands with elegant modern aesthetics...</p><p>Key factors include choosing BWP waterproof ply, anti-scratch acrylic shutters, and smart corner carousel storage.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'category_id' => $blogCat->id,
                'published_at' => now(),
                'is_featured' => true,
            ],
            [
                'title' => 'Sliding vs Hinged Wardrobes: Which is Right for Your Bedroom?',
                'slug' => 'sliding-vs-hinged-wardrobes',
                'excerpt' => 'An in-depth architectural comparison of space utilization, sliding glass profiles, and hinged loft storage systems.',
                'content' => '<p>When choosing wardrobes, floor area is the most critical decision factor. Sliding glass wardrobes save clearance space...</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'category_id' => $blogCat->id,
                'published_at' => now(),
                'is_featured' => true,
            ],
            [
                'title' => 'Living Room Lighting Guide: Master Ambient, Task & Accent Layers',
                'slug' => 'living-room-lighting-guide',
                'excerpt' => 'Learn how to elevate your living room ambiance using COB spotlights, magnetic track lights, and perimeter cove LED lighting.',
                'content' => '<p>Lighting defines the emotional feel of luxury interiors. Layering 3000K warm white lighting creates warmth and sophistication...</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'category_id' => $blogCat->id,
                'published_at' => now(),
                'is_featured' => false,
            ],
        ];

        foreach ($blogsData as $bData) {
            Blog::updateOrCreate(['slug' => $bData['slug']], $bData);
        }

        // 11. GLOBAL SETTINGS & SOCIAL LINKS
        $settings = [
            'site_name' => 'ARCHOVEX INFRA PRIVATE LIMITED',
            'site_tagline' => 'Architectural & Premium Interior Design Studio',
            'logo' => '/logo.png',
            'phone' => '+91 98765 43210',
            'email' => 'contact@archovex.com',
            'whatsapp' => '+919876543210',
            'address' => 'ARCHOVEX INFRA HQ, Connaught Place, New Delhi 110001',
            'copyright' => '© ' . date('Y') . ' ARCHOVEX INFRA PRIVATE LIMITED. All rights reserved.',
            'default_meta_title' => 'ARCHOVEX INFRA PRIVATE LIMITED | Premium Interior Design & Turnkey Execution',
            'default_meta_description' => 'ARCHOVEX INFRA PRIVATE LIMITED offers luxury modular kitchens, living room designs, sliding wardrobes, and turnkey home interiors across India.',
            'google_analytics_id' => 'G-ARCHOVEX123',
        ];

        foreach ($settings as $key => $val) {
            Setting::setValue($key, $val, 'general');
        }

        $socials = [
            ['platform' => 'Instagram', 'url' => 'https://instagram.com/archovexinfra', 'icon' => 'instagram', 'sort_order' => 1],
            ['platform' => 'Facebook', 'url' => 'https://facebook.com/archovexinfra', 'icon' => 'facebook', 'sort_order' => 2],
            ['platform' => 'Pinterest', 'url' => 'https://pinterest.com/archovexinfra', 'icon' => 'pinterest', 'sort_order' => 3],
            ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/company/archovexinfra', 'icon' => 'linkedin', 'sort_order' => 4],
            ['platform' => 'YouTube', 'url' => 'https://youtube.com/@archovexinfra', 'icon' => 'youtube', 'sort_order' => 5],
        ];

        foreach ($socials as $soc) {
            SocialLink::updateOrCreate(['platform' => $soc['platform']], $soc);
        }

        // 12. DYNAMIC HEADER & MEGA MENU SEED DATA
        $headerMenu = Menu::updateOrCreate(['location' => 'header'], [
            'name' => 'Primary Navigation',
            'location' => 'header',
            'status' => true,
        ]);
        $headerMenu->items()->delete();

        $navItems = [
            ['label' => 'Home', 'url' => '/', 'type' => 'link', 'sort_order' => 1],
            [
                'label' => 'Design Gallery',
                'url' => '/designs',
                'type' => 'megamenu',
                'sort_order' => 2,
                'mega' => [
                    [
                        'title' => 'Modular Kitchens',
                        'items' => [
                            ['label' => 'L-Shaped Kitchens', 'url' => '/designs/modular-kitchen-designs?layout=L-Shaped'],
                            ['label' => 'Island Kitchens', 'url' => '/designs/modular-kitchen-designs?layout=Island'],
                            ['label' => 'Parallel Kitchens', 'url' => '/designs/modular-kitchen-designs?layout=Parallel'],
                            ['label' => 'All Kitchen Designs', 'url' => '/designs/modular-kitchen-designs'],
                        ]
                    ],
                    [
                        'title' => 'Living Rooms',
                        'items' => [
                            ['label' => 'Modern Luxury', 'url' => '/designs/living-room-designs?style=Luxury'],
                            ['label' => 'Minimal Scandinavian', 'url' => '/designs/living-room-designs?style=Scandinavian'],
                            ['label' => 'TV Console Walls', 'url' => '/designs/living-room-designs'],
                        ]
                    ],
                    [
                        'title' => 'Wardrobes & Storage',
                        'items' => [
                            ['label' => 'Sliding Glass Profile', 'url' => '/designs/wardrobe-designs'],
                            ['label' => 'Luxury Walk-in Closets', 'url' => '/designs/wardrobe-designs'],
                            ['label' => 'Floor-to-Ceiling Wardrobes', 'url' => '/designs/wardrobe-designs'],
                        ]
                    ],
                ]
            ],
            ['label' => 'Cities', 'url' => '/cities', 'type' => 'link', 'sort_order' => 3],
            ['label' => 'Contact', 'url' => '/contact', 'type' => 'link', 'sort_order' => 4],
        ];

        foreach ($navItems as $niData) {
            $megaCols = $niData['mega'] ?? null;
            unset($niData['mega']);

            $niData['menu_id'] = $headerMenu->id;
            $itemObj = MenuItem::create($niData);

            if ($megaCols) {
                foreach ($megaCols as $colIdx => $mc) {
                    $colObj = MegaMenuColumn::create([
                        'menu_item_id' => $itemObj->id,
                        'title' => $mc['title'],
                        'sort_order' => $colIdx + 1,
                    ]);

                    foreach ($mc['items'] as $mItemIdx => $mi) {
                        MegaMenuItem::create([
                            'mega_menu_column_id' => $colObj->id,
                            'label' => $mi['label'],
                            'url' => $mi['url'],
                            'sort_order' => $mItemIdx + 1,
                        ]);
                    }
                }
            }
        }
    }
}
