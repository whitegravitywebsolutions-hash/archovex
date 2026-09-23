<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\MegaMenuColumn;
use App\Models\MegaMenuItem;
use Illuminate\Http\Request;

class AdminMenuController extends Controller
{
    public function index()
    {
        $menu = Menu::with([
            'items' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            },
            'items.megaColumns' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            },
            'items.megaColumns.items' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            }
        ])->where('location', 'header')->first();

        if (!$menu) {
            $menu = Menu::create([
                'name' => 'Main Header Menu',
                'location' => 'header',
                'is_active' => true,
            ]);
        }

        return response()->json(['success' => true, 'data' => $menu]);
    }

    public function storeItem(Request $request)
    {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'parent_id' => 'nullable|exists:menu_items,id',
            'label' => 'required|string|max:255',
            'url' => 'nullable|string',
            'type' => 'required|string', // link, category, city, megamenu
            'icon' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'open_new_tab' => 'boolean',
        ]);

        $item = MenuItem::create($validated);

        return response()->json(['success' => true, 'message' => 'Menu item added successfully', 'data' => $item], 201);
    }

    public function updateItem(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'nullable|string',
            'type' => 'required|string',
            'icon' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'open_new_tab' => 'boolean',
        ]);

        $item->update($validated);

        return response()->json(['success' => true, 'message' => 'Menu item updated successfully', 'data' => $item]);
    }

    public function destroyItem($id)
    {
        MenuItem::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Menu item deleted successfully']);
    }

    public function reorderItems(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:menu_items,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->items as $it) {
            MenuItem::where('id', $it['id'])->update(['sort_order' => $it['sort_order']]);
        }

        return response()->json(['success' => true, 'message' => 'Menu items reordered successfully']);
    }

    /* -------------------------------------------------------------------------- */
    /* MEGA MENU COLUMNS                                                          */
    /* -------------------------------------------------------------------------- */
    public function storeMegaColumn(Request $request)
    {
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'title' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $column = MegaMenuColumn::create($validated);

        return response()->json(['success' => true, 'message' => 'Mega menu column added successfully', 'data' => $column], 201);
    }

    public function updateMegaColumn(Request $request, $id)
    {
        $column = MegaMenuColumn::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $column->update($validated);

        return response()->json(['success' => true, 'message' => 'Mega menu column updated successfully', 'data' => $column]);
    }

    public function destroyMegaColumn($id)
    {
        MegaMenuColumn::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Mega menu column deleted successfully']);
    }

    /* -------------------------------------------------------------------------- */
    /* MEGA MENU ITEMS                                                            */
    /* -------------------------------------------------------------------------- */
    public function storeMegaItem(Request $request)
    {
        $validated = $request->validate([
            'mega_menu_column_id' => 'required|exists:mega_menu_columns,id',
            'label' => 'required|string|max:255',
            'url' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $item = MegaMenuItem::create($validated);

        return response()->json(['success' => true, 'message' => 'Mega menu item added successfully', 'data' => $item], 201);
    }

    public function updateMegaItem(Request $request, $id)
    {
        $item = MegaMenuItem::findOrFail($id);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $item->update($validated);

        return response()->json(['success' => true, 'message' => 'Mega menu item updated successfully', 'data' => $item]);
    }

    public function destroyMegaItem($id)
    {
        MegaMenuItem::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Mega menu item deleted successfully']);
    }
}
