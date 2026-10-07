<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DesignPost;
use App\Models\DesignPostImage;
use App\Models\SeoMetadata;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DesignPostsSeeder extends Seeder
{
    public function run()
    {
        $postsData = [
            [
                'title' => 'Top 10 L-Shaped Layout Ideas for Modern Homes',
                'category_ids' => [6, 5],
                'city_ids' => [1, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Discover how L-shaped layouts optimize workspace efficiency, corner accessibility, and storage capacity for modern apartments.',
                'description' => '<h2>Why L-Shaped Layouts are Perfect for Modern Residences</h2><p>L-shaped layouts are among the most popular design choices for contemporary urban residences. By utilizing two adjacent walls, this configuration creates an efficient work triangle while keeping central floor space open and uncluttered.</p><h3>Key Advantages of L-Shaped Configurations</h3><ul><li><strong>Maximized Corner Utility:</strong> Carousel units and magic pull-outs make full use of corner areas.</li><li><strong>Seamless Appliance Integration:</strong> Built-in ovens, chimneys, and dishwashers maintain a sleek visual silhouette.</li><li><strong>Premium Material Finishes:</strong> Soft-touch matte laminates, acrylic panels, and quartz surfaces.</li></ul><p>Whether for compact apartments or spacious homes, L-shaped configurations offer exceptional flexibility and timeless appeal.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Luxury Living Room Decor & Ambient Lighting Guide',
                'category_ids' => [7, 14],
                'city_ids' => [2, 3],
                'featured_image' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Elevate main living spaces with premium marble flooring, custom fluted panel accent walls, and warm ambient lighting layers.',
                'description' => '<h2>Designing a Statement Living Room</h2><p>Luxury living rooms require thoughtful design that harmonizes sophistication, comfort, and architectural details. As the central gathering point of the home, the main lounge sets the tone for your entire aesthetic.</p><h3>Essential Design Elements</h3><ul><li><strong>Fluted Wall Paneling:</strong> Adds texture, visual height, and acoustic absorption.</li><li><strong>Statement Marble & Quartz:</strong> Timeless flooring and entertainment unit backdrops.</li><li><strong>Layered Architectural Lighting:</strong> Cove LED strips, magnetic track spotlights, and designer pendants.</li></ul>',
                'is_featured' => true,
            ],
            [
                'title' => 'Space-Saving Master Bedroom Interior Design Hacks',
                'category_ids' => [8, 9],
                'city_ids' => [3, 7],
                'featured_image' => 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Smart spatial planning strategies and full-height storage solutions designed to maximize bedroom comfort and organization.',
                'description' => '<h2>Maximizing Master Bedroom Comfort</h2><p>Urban bedroom planning demands clever spatial efficiency. Combining full-height sliding storage with upholstered headboards and concealed bed drawers transforms compact spaces into serene, orderly retreats.</p><h3>Top Interior Strategies</h3><ul><li>Floor-to-ceiling sliding wardrobes with tinted glass or mirror panels.</li><li>Neutral color palettes paired with natural oak or walnut tones.</li><li>Integrated floating bedside tables and vanity counters.</li></ul>',
                'is_featured' => true,
            ],
            [
                'title' => 'Minimalist Floor-to-Ceiling Wardrobe Styles & Finishes',
                'category_ids' => [9, 8],
                'city_ids' => [8, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Explore sliding and hinged storage configurations featuring integrated LED profiles, lacquered glass, and anti-fingerprint surfaces.',
                'description' => '<h2>Custom Storage Solutions for Modern Homes</h2><p>Built-in storage units are pivotal architectural elements in interior planning. Minimalist styles offer maximum vertical capacity while maintaining a clean, cohesive silhouette.</p><h3>Popular Material Finishes</h3><p>Choose from anti-fingerprint matte laminates, lacquered back-painted glass, or natural wood veneers to complement your overall theme.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Complete Guide to Turnkey Home Interiors & Space Planning',
                'category_ids' => [5, 14],
                'city_ids' => [7, 3],
                'featured_image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'End-to-end residential execution covering layout planning, false ceilings, custom joinery, fitted modules, and lighting integration.',
                'description' => '<h2>End-to-End Residential Design Execution</h2><p>Moving into a new home? Comprehensive turnkey design ensures a seamless visual theme across all rooms, eliminating multi-vendor coordination complexities.</p><h3>Key Package Highlights</h3><ul><li>Detailed 3D Visualization & Space Planning.</li><li>Fitted Storage & Functional Work Zones.</li><li>False Ceilings with Energy-Efficient LED Profiles.</li><li>Custom Seating, Dining Tables & Ambient Lighting.</li></ul>',
                'is_featured' => true,
            ],
            [
                'title' => 'Modern Workplace Design Trends for High-Performance Teams',
                'category_ids' => [11, 12],
                'city_ids' => [2, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Transform professional work environments with open layouts, ergonomic furniture, and acoustic soundproof meeting pods.',
                'description' => '<h2>Future-Ready Workplace Interiors</h2><p>Modern office environments focus on collaborative spaces, biophilic accents, and acoustic comfort to boost team well-being, focus, and productivity.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Budget-Friendly Home Remodeling & Renovation Tips',
                'category_ids' => [10, 5],
                'city_ids' => [1, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Revamp aging spaces with modern tiling, updated fixtures, optimized floor plans, and fresh paint palettes without exceeding budget.',
                'description' => '<h2>Breathing New Life into Older Spaces</h2><p>Renovating existing properties requires structural assessment paired with smart aesthetic upgrades. Targeted updates to lighting, storage, and wall treatments completely revitalize established layouts.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Luxury Commercial Space & Showroom Design Solutions',
                'category_ids' => [13, 14],
                'city_ids' => [3, 7],
                'featured_image' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Tailored commercial environments and display hubs engineered for high visitor flow, brand prestige, and material durability.',
                'description' => '<h2>Commercial Space Excellence</h2><p>Commercial interior planning combines striking brand aesthetics with durable, low-maintenance materials suited for continuous public use.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Single-Window Project Execution vs Multi-Vendor Contracting',
                'category_ids' => [14, 5],
                'city_ids' => [1, 2, 3],
                'featured_image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Compare single-point turnkey management with multi-party contractor supervision for schedule reliability, cost transparency, and finish quality.',
                'description' => '<h2>Why Turnkey Management Delivers Results</h2><p>Coordinating independent trades often leads to project delays and budget variations. Turnkey execution offers a single point of accountability from initial concept through final handover.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Island Countertop Layout Ideas for Spacious Homes',
                'category_ids' => [6, 14],
                'city_ids' => [2, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Transform open layouts into culinary and social hubs with waterfall quartz counters, breakfast bars, and overhead ventilation hoods.',
                'description' => '<h2>The Ultimate Statement: Central Island Countertops</h2><p>Central island features add functional food preparation surfaces and casual seating zones to generous open-plan homes.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Scandinavian Aesthetics & Hygge Home Decor Trends',
                'category_ids' => [7, 5],
                'city_ids' => [3, 7],
                'featured_image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Embrace light wood textures, warm neutral grays, natural greenery, and cozy hygge elements for bright, restful living spaces.',
                'description' => '<h2>Nordic Simplicity in Modern Interiors</h2><p>Scandinavian design emphasizes clean geometry, ergonomic furniture, and abundant natural light—creating calm, welcoming home environments.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Ergonomic Workstation Layouts & Office Acoustics',
                'category_ids' => [12, 11],
                'city_ids' => [8, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Design corporate workspaces with height-adjustable desks, supportive seating, and acoustic paneling for optimal comfort.',
                'description' => '<h2>Designing High-Performance Workspaces</h2><p>Prioritizing ergonomic support reduces physical strain and enhances daily focus. Discover top layout principles for modern corporate hubs.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Walk-In Closet Ideas with Tinted Glass & Motion Lighting',
                'category_ids' => [9, 8],
                'city_ids' => [2, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Step inside custom walk-in dressing spaces featuring glass doors, dedicated accessory drawers, and sensor-driven LED wardrobe lighting.',
                'description' => '<h2>Custom Dressing Suite Interiors</h2><p>Walk-in storage suites offer dedicated dressing areas fitted with pull-out shoe organizers, tie trays, and illuminated display shelves.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Small Bedroom Layout Hacks to Maximize Storage & Comfort',
                'category_ids' => [8, 10],
                'city_ids' => [7, 3],
                'featured_image' => 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Smart multi-functional bed platforms, wall-mounted study ledge surfaces, and optical mirror accents for compact bedrooms.',
                'description' => '<h2>Making Small Spaces Feel Expansive</h2><p>Thoughtful furniture scale, wall sconces in place of bulky bedside tables, and vertical storage keep compact bedrooms open and clutter-free.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Complete Home Transformation: A Modern Interior Case Study',
                'category_ids' => [10, 6],
                'city_ids' => [1, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'A complete overview of transforming an established floor plan into an open, light-filled contemporary living environment.',
                'description' => '<h2>Comprehensive Living Space Transformation</h2><p>Case study illustrating structural wall adjustments, upgraded electrical infrastructure, fresh acrylic joinery, and modern bathroom fixture installations.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Boutique Retail Display Concepts & Customer Flow Design',
                'category_ids' => [13, 11],
                'city_ids' => [2, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Engage visitors with directional lighting displays, feature display walls, and intuitive retail floor layouts.',
                'description' => '<h2>Retail Space Planning Excellence</h2><p>High-end retail displays require strategic customer movement paths, focused spotlighting, and tailored display fixtures that highlight products effectively.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Parallel Layout Transformations for Passionate Home Chefs',
                'category_ids' => [6, 14],
                'city_ids' => [3, 7],
                'featured_image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Parallel countertop configurations offer efficient dual work zones and optimized movement for passionate home cooks.',
                'description' => '<h2>The Professional Choice: Parallel Configurations</h2><p>Popular in modern apartments, parallel layouts separate wet and dry prep zones effortlessly while keeping essential appliances within easy reach.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Cozy Boho Chic Living Space Styling & Layering Tips',
                'category_ids' => [7, 10],
                'city_ids' => [1, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Combine woven textures, macrame wall hangings, warm terracotta color tones, and botanical greenery for a relaxed boho feel.',
                'description' => '<h2>Boho Chic Aesthetics for Urban Living</h2><p>Bohemian styling introduces warmth and character through tactile cushions, patterned area rugs, natural timber accents, and soft ambient lighting.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Smart Lighting Automation & Mood Scene Control for Residences',
                'category_ids' => [5, 7],
                'city_ids' => [2, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Integrate app-controlled lighting scenes, automated shading, and voice-activated controls into luxury modern residences.',
                'description' => '<h2>Smart Home Automation Meets Fine Interior Design</h2><p>Modern residential design integrates smart automation controls that smoothly adjust lighting warmth and window shades according to time of day.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Biophilic Design Principles for Healthy & Productive Workspaces',
                'category_ids' => [11, 13],
                'city_ids' => [3, 7],
                'featured_image' => 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Incorporate preserved moss walls, natural timber elements, and daylight optimization to enhance air quality and focus.',
                'description' => '<h2>Integrating Nature into Indoor Environments</h2><p>Biophilic workplace planning uses living greenery, natural light pathways, and organic textures to create revitalizing work environments.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Acrylic Gloss Finish vs Soft Matte Finish for Modern Homes',
                'category_ids' => [6, 5],
                'city_ids' => [8, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'High-gloss acrylic surfaces offer reflective elegance, durability, and easy maintenance for contemporary home joinery.',
                'description' => '<h2>Polished Sophistication: Gloss vs Matte Finishes</h2><p>Acrylic surfaces reflect light effectively, making room layouts feel expansive while delivering robust moisture and scratch resistance.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'False Ceiling Designs & Concealed Ambient Lighting Guide',
                'category_ids' => [8, 14],
                'city_ids' => [1, 2],
                'featured_image' => 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Plan indirect LED cove channels, magnetic spotlight tracks, and clean gypsum false ceiling treatments for bedroom suites.',
                'description' => '<h2>Ceiling Design & Atmosphere Creation</h2><p>False ceiling installations conceal electrical conduit while casting soft indirect illumination that creates a calming atmosphere.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Mirror Sliding Door Solutions for Compact Bedrooms',
                'category_ids' => [9, 8],
                'city_ids' => [7, 3],
                'featured_image' => 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Combine full-length dressing mirrors with smooth sliding mechanisms for compact bedroom floor plans.',
                'description' => '<h2>Dual-Purpose Storage Design</h2><p>Full-height mirror sliding doors function as full dressing mirrors while reflecting light to visually expand smaller room proportions.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Open Concept Living & Dining Room Integration Ideas',
                'category_ids' => [7, 14],
                'city_ids' => [2, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Establish fluid transitions between dining areas, seating lounges, and media consoles in modern open-plan residences.',
                'description' => '<h2>Open-Plan Interior Cohesion</h2><p>Utilize timber ceiling beams, metal divider screens, or subtle rug zoning to delineate living and dining zones without solid partition walls.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Executive Boardroom & Conference Room Interior Guidelines',
                'category_ids' => [12, 13],
                'city_ids' => [1, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'State-of-the-art conference rooms featuring integrated audiovisual cables, acoustic fabric walls, and executive conference tables.',
                'description' => '<h2>Professional Corporate Meeting Hubs</h2><p>Boardrooms reflect your corporate identity during client meetings. Seamless video conferencing infrastructure and soundproofing ensure uninterrupted collaboration.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Complete Multi-Level Residence Execution & Architectural Unity',
                'category_ids' => [14, 5],
                'city_ids' => [3, 7],
                'featured_image' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Multi-level home design featuring double-height void lighting, private lounge corners, and integrated bedroom storage.',
                'description' => '<h2>Multi-Level Architectural Harmony</h2><p>Designing multi-level residences requires careful visual continuity across floors, staircase details, and double-height living room feature walls.</p>',
                'is_featured' => true,
            ],
            [
                'title' => 'Polyurethane Finish vs High-Pressure Laminate Material Guide',
                'category_ids' => [6, 10],
                'city_ids' => [1, 2, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'An in-depth material comparison of Polyurethane (PU) painted surfaces versus High-Pressure Laminates (HPL) for durability and cost.',
                'description' => '<h2>PU vs Laminate Surface Comparison</h2><p>PU finishes provide seamless edge-to-edge painted elegance, whereas high-pressure laminates deliver economical, scratch-resistant performance for active spaces.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Contemporary Dining & Hospitality Space Interior Concepts',
                'category_ids' => [13, 14],
                'city_ids' => [2, 1],
                'featured_image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Photogenic dining interiors featuring accent lighting, exposed ceiling textures, warm timber booth seating, and beverage counters.',
                'description' => '<h2>Creating Experiential Hospitality Environments</h2><p>Hospitality interior planning focuses on guest experience, ambient mood lighting, and distinctive design walls that leave a lasting impression.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Balcony & Terrace Retreats with Outdoor Decking',
                'category_ids' => [10, 7],
                'city_ids' => [1, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Convert outdoor balcony corners into cozy relaxation nooks, vertical gardens, or coffee bars using weather-proof deck tiles.',
                'description' => '<h2>Transforming Balconies into Green Havens</h2><p>Weather-resistant deck tiles, artificial turf, hanging seating, and planter walls transform compact balconies into relaxing outdoor retreats.</p>',
                'is_featured' => false,
            ],
            [
                'title' => 'Ultra-Luxury Penthouse Interior Design & Panoramic Layouts',
                'category_ids' => [5, 14],
                'city_ids' => [2, 1, 8],
                'featured_image' => 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
                ],
                'short_description' => 'Ultra-luxury penthouse design featuring expansive glass walls, custom bar lounges, home automation, and Italian marble surfaces.',
                'description' => '<h2>Unrivaled Opulence: Penthouse Interiors</h2><p>Penthouse interior planning merges wide exterior views with bespoke joinery, marble feature walls, and ambient architectural lighting.</p>',
                'is_featured' => true,
            ],
        ];

        foreach ($postsData as $index => $item) {
            $slug = Str::slug($item['title']);

            $post = DesignPost::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $item['category_ids'][0],
                    'category_ids' => $item['category_ids'],
                    'city_id' => $item['city_ids'][0],
                    'city_ids' => $item['city_ids'],
                    'title' => $item['title'],
                    'short_description' => $item['short_description'],
                    'description' => $item['description'],
                    'content' => $item['description'],
                    'featured_image' => $item['featured_image'],
                    'status' => 'published',
                    'is_featured' => $item['is_featured'],
                    'sort_order' => $index + 1,
                    'published_at' => Carbon::now()->subDays($index * 2),
                    'meta_title' => $item['title'] . ' | Archovex Interior Design',
                    'meta_description' => $item['short_description'],
                ]
            );

            // Sync gallery images
            DesignPostImage::where('design_post_id', $post->id)->delete();
            foreach ($item['gallery'] as $imgIdx => $galleryUrl) {
                DesignPostImage::create([
                    'design_post_id' => $post->id,
                    'image' => $galleryUrl,
                    'alt_text' => $post->title . ' Image ' . ($imgIdx + 1),
                    'sort_order' => $imgIdx + 1,
                    'is_primary' => ($imgIdx === 0),
                    'is_mobile' => ($imgIdx === 0),
                ]);
            }

            // Sync SEO Metadata for /designs/ and /services/
            SeoMetadata::updateOrCreate(
                ['path' => '/designs/' . $post->slug],
                [
                    'meta_title' => $item['title'] . ' | Archovex Interior Design',
                    'meta_description' => $item['short_description'],
                    'og_title' => $item['title'],
                    'og_description' => $item['short_description'],
                    'og_image' => $item['featured_image'],
                    'og_type' => 'article',
                    'robots_index' => true,
                    'robots_follow' => true,
                ]
            );
        }
    }
}
